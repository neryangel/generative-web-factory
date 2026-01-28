import type { ReactNode } from 'react';
import { Component } from 'react';
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
