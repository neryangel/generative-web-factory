import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center" dir="rtl">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">משהו השתבש</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            אירעה שגיאה בלתי צפויה. נסה לרענן את הדף או לחזור מאוחר יותר.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-xs bg-muted p-2 rounded mb-4 max-w-md overflow-auto text-right">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              רענן דף
            </Button>
            <Button 
              variant="outline"
              onClick={this.handleReset}
            >
              נסה שוב
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper for dashboard-level error boundary
 */
export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // In production, you'd send this to an error tracking service
        console.error('Dashboard error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Wrapper for editor-level error boundary with custom messaging
 */
export function EditorErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full flex-col items-center justify-center p-8 text-center" dir="rtl">
          <div className="rounded-full bg-amber-500/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">שגיאה בעורך</h3>
          <p className="text-sm text-muted-foreground mb-4">
            אירעה שגיאה בטעינת העורך. נסה לרענן את הדף.
          </p>
          <Button size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            רענן דף
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
