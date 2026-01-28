# Testing Patterns & Framework

## Framework & Setup

### Test Runner: Vitest
- Configuration: `/Users/user/generative-web-factory/vitest.config.ts`
- Version: `^3.2.4`

**Configuration:**
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",           // Browser-like environment
    globals: true,                  // describe, it, expect globally available
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### Global Test Setup
File: `/src/test/setup.ts`

**Mocks Provided:**
- `matchMedia` for responsive components
- `ResizeObserver` for Radix UI and chart components
- `IntersectionObserver` for lazy loading and scroll animations
- Imports `@testing-library/jest-dom` for extended matchers

```typescript
// Mock matchMedia for responsive components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
```

### Dependencies
- `@testing-library/react`: ^16.0.0
- `@testing-library/jest-dom`: ^6.6.0
- `@testing-library/user-event`: ^14.6.1 (for user interactions)
- `jsdom`: ^20.0.3 (DOM environment)
- `vitest`: ^3.2.4

## Test Commands

From `/Users/user/generative-web-factory/package.json`:

```bash
npm test              # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test File Organization

### Locations
- **Co-located**: `src/api/*.api.test.ts` - API test files in same directory
- **`__tests__` subdirectory**: `src/components/accessibility/__tests__/*.test.tsx` - Component tests
- **Preference**: Co-located with source files

### File Naming
- Pattern: `<filename>.test.ts` or `<filename>.test.tsx`
- Examples from codebase:
  - `/src/api/domains.api.test.ts`
  - `/src/components/common/ConfirmDialog.test.tsx`
  - `/src/hooks/useAuth.test.tsx`
  - `/src/lib/helpers.test.ts`

## Mocking Patterns

### Module Mocking
Using `vi.mock()` for external dependencies:

**Pattern from `/src/api/domains.api.test.ts`:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { domainsApi } from './domains.api';

// Create mock functions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      mockFrom(table);
      return {
        select: (...args: unknown[]) => {
          mockSelect(...args);
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs);
              return Promise.resolve({ data: [], error: null });
            },
          };
        },
        insert: (data: Record<string, unknown>) => {
          mockInsert(data);
          return {
            select: () => ({
              single: () => {
                mockSingle();
                return Promise.resolve({
                  data: { id: 'new-domain-id', ...data },
                  error: null,
                });
              },
            }),
          };
        },
      };
    },
    functions: {
      invoke: (name: string, options: unknown) => {
        mockFunctionsInvoke(name, options);
        return Promise.resolve({
          data: { id: 'domain-1', status: 'verified' },
          error: null,
        });
      },
    },
  },
}));
```

### Function Mocking
```typescript
const mockFn = vi.fn();
const mockFnWithReturnValue = vi.fn().mockResolvedValue({ data: null });
```

### Clearing Mocks
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Testing Patterns

### API/Integration Tests
File: `/src/api/domains.api.test.ts`

**Structure:**
1. Create mock functions for external service
2. Mock the module
3. Group tests by function with nested `describe` blocks
4. Test each scenario (success, error, edge cases)

```typescript
describe('domainsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBySiteId', () => {
    it('should fetch all domains for a site', async () => {
      const siteId = 'site-1';
      await domainsApi.getBySiteId(siteId);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockOrder).toHaveBeenCalledWith('created_at');
    });

    it('should return empty array when no domains exist', async () => {
      const result = await domainsApi.getBySiteId('site-1');
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new domain with pending status', async () => {
      const domainData = {
        domain: 'example.com',
        site_id: 'site-1',
        tenant_id: 'tenant-1',
      };

      const result = await domainsApi.create(domainData);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockInsert).toHaveBeenCalledWith({
        ...domainData,
        status: 'pending',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status', 'pending');
    });
  });
});
```

### Component Tests (React Testing Library)
File: `/src/components/common/ConfirmDialog.test.tsx`

**Pattern:**
1. Set up default props
2. Use `render()` from Testing Library
3. Query DOM using semantic selectors (`getByRole`, `getByText`)
4. Use `userEvent.setup()` for interactions

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
  };

  describe('visibility', () => {
    it('should render dialog when open', () => {
      render(<ConfirmDialog {...defaultProps} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should not render dialog when closed', () => {
      render(<ConfirmDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('confirm action', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      await user.click(screen.getByRole('button', { name: 'אישור' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should close dialog after confirm', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ConfirmDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'אישור' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
```

### Custom Hook Tests
File: `/src/hooks/useAuth.test.tsx`

**Pattern:**
1. Mock external dependencies
2. Create wrapper component for providers
3. Use `renderHook()` from Testing Library
4. Use `act()` for state updates
5. Use `waitFor()` for async operations

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './useAuth';

describe('useAuth', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const mockSession = {
    access_token: 'mock-token',
    user: { id: 'user-1', email: 'test@example.com' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
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
  });
});
```

### Unit Tests (Utilities)
File: `/src/lib/helpers.test.ts`

**Pattern:**
1. Test function with various inputs
2. Assert expected outputs
3. Test edge cases
4. For time-based tests, use `vi.useFakeTimers()`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSlug, formatRelativeTime } from './helpers';

describe('helpers', () => {
  describe('generateSlug', () => {
    it('should convert string to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello! @World#')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "עכשיו" for recent times', () => {
      const result = formatRelativeTime('2024-01-15T11:59:30');
      expect(result).toBe('עכשיו');
    });

    it('should return minutes ago', () => {
      const result = formatRelativeTime('2024-01-15T11:55:00');
      expect(result).toBe('לפני 5 דקות');
    });
  });
});
```

### Error Boundary Tests
File: `/src/components/accessibility/__tests__/WidgetErrorBoundary.test.tsx`

**Pattern:**
1. Suppress console errors during test
2. Create throwing child component
3. Test error handling behavior

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WidgetErrorBoundary } from '../components/WidgetErrorBoundary';

describe('WidgetErrorBoundary', () => {
  it('should render nothing when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <WidgetErrorBoundary>
        <ThrowingChild />
      </WidgetErrorBoundary>
    );

    expect(container.innerHTML).toBe('');
    spy.mockRestore();
  });

  it('should not crash the surrounding app', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <div data-testid="app">
        <WidgetErrorBoundary>
          <ThrowingChild />
        </WidgetErrorBoundary>
        <div data-testid="rest-of-app">Still here</div>
      </div>
    );

    expect(screen.getByTestId('rest-of-app')).toBeInTheDocument();
    spy.mockRestore();
  });
});
```

## Querying Best Practices

### Preferred Query Methods (in order)
1. `getByRole()` - Semantic queries (most accessible)
2. `getByLabelText()` - For form inputs
3. `getByPlaceholderText()` - As fallback for inputs
4. `getByText()` - For general text
5. `getByTestId()` - Last resort
6. `queryByX()` - When checking element doesn't exist
7. `findByX()` - For async queries

Example:
```typescript
expect(screen.getByRole('alertdialog')).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'אישור' })).toBeInTheDocument();
expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
```

## Assertion Patterns

### Common Matchers (from jest-dom)
- `.toBeInTheDocument()` - Element exists in DOM
- `.not.toBeInTheDocument()` - Element doesn't exist
- `.toHaveClass()` - Element has CSS class
- `.toHaveBeenCalled()` - Function was called
- `.toHaveBeenCalledWith()` - Function called with args
- `.toHaveBeenCalledTimes(n)` - Function called n times
- `.toEqual()` - Deep equality check
- `.toBe()` - Strict equality check

### Waiting for Async Operations
```typescript
// For async state updates
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});

// For hook state changes with actions
await act(async () => {
  await result.current.signIn('test@example.com', 'password123');
});
```

## Test Isolation & Cleanup

### Setup/Teardown
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  // Reset any shared state
});

afterEach(() => {
  // Cleanup (usually automatic)
});

describe('Feature', () => {
  // Tests are isolated
});
```

### Fake Timers
```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-15T12:00:00'));
});

afterEach(() => {
  vi.useRealTimers();
});

// In test
vi.advanceTimersByTime(100);
```

## Coverage Goals

While no explicit coverage percentage is set in config, the codebase demonstrates:
- **API functions**: Comprehensive test coverage
- **Components**: Visibility, content, interactions, state changes
- **Hooks**: State initialization, effects, callbacks, error cases
- **Utilities**: Input validation, edge cases, transformations

Run: `npm run test:coverage` to generate coverage reports

## Testing JavaScript vs TypeScript

- Tests are written in `.test.ts` (utilities) and `.test.tsx` (React components)
- Type safety is maintained in tests
- Mocks are typed with proper inference
- Return types are verified through assertions
