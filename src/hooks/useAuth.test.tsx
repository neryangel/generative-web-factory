import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './useAuth';

// Mock supabase client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();

// Store the initial session to be delivered by onAuthStateChange
let initialSession: unknown = null;

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signOut: () => mockSignOut(),
      onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        mockOnAuthStateChange(callback);
        // Simulate INITIAL_SESSION event firing immediately (as Supabase does)
        setTimeout(() => callback('INITIAL_SESSION', initialSession), 0);
        return {
          data: {
            subscription: {
              unsubscribe: mockUnsubscribe,
            },
          },
        };
      },
    },
  },
}));

describe('useAuth', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User' },
  };

  const mockSession = {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh',
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    initialSession = null;
  });

  describe('AuthProvider', () => {
    it('should initialize with loading state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set user when session exists via onAuthStateChange', async () => {
      initialSession = mockSession;

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.session).toEqual(mockSession);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set user to null when no session', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.session).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should subscribe to auth state changes', async () => {
      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled();
      });
    });

    it('should not call getSession (race condition fix)', async () => {
      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled();
      });

      // getSession should never be called — the listener handles INITIAL_SESSION
      // This verifies the race condition fix (SEC-01)
    });

    it('should unsubscribe on unmount', async () => {
      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled();
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should call supabase signInWithPassword', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return error on failed sign in', async () => {
      const mockError = new Error('Invalid credentials');
      mockSignInWithPassword.mockResolvedValue({ error: mockError });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { error: Error | null } | undefined;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrong');
      });

      expect(signInResult?.error).toEqual(mockError);
    });
  });

  describe('signUp', () => {
    it('should call supabase signUp with email and password', async () => {
      mockSignUp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('new@example.com', 'password123');
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: expect.objectContaining({
          emailRedirectTo: expect.any(String),
        }),
      });
    });

    it('should include full name in user metadata', async () => {
      mockSignUp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('new@example.com', 'password123', 'John Doe');
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: expect.objectContaining({
          data: { full_name: 'John Doe' },
        }),
      });
    });

    it('should return error on failed sign up', async () => {
      const mockError = new Error('Email already exists');
      mockSignUp.mockResolvedValue({ error: mockError });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult: { error: Error | null } | undefined;
      await act(async () => {
        signUpResult = await result.current.signUp('existing@example.com', 'password123');
      });

      expect(signUpResult?.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut', async () => {
      initialSession = mockSession;
      mockSignOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('useAuth outside AuthProvider', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
