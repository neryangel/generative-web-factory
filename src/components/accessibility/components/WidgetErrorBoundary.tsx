/**
 * WidgetErrorBoundary - Error boundary פנימי לווידג'ט הנגישות
 * מונע מבאג בווידג'ט להפיל את כל האפליקציה
 */

import React from 'react';

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

export class WidgetErrorBoundary extends React.Component<
  { children: React.ReactNode },
  WidgetErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AccessibilityWidget] Error:', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — the app continues to work without the widget
      return null;
    }
    return this.props.children;
  }
}
