/**
 * Provider-agnostic analytics module for conversion funnel tracking.
 *
 * Supports event queuing before provider initialization, dev mode
 * (console.log), and production mode. Connect any provider (PostHog,
 * Mixpanel, Amplitude) by implementing AnalyticsProvider and calling
 * analytics.setProvider().
 */

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AnalyticsProvider {
  track(name: string, properties?: EventProperties): void;
  page(path: string, properties?: EventProperties): void;
  identify(userId: string, traits?: EventProperties): void;
}

interface QueuedEvent {
  type: 'track' | 'page' | 'identify';
  args: [string, EventProperties?];
  timestamp: number;
}

export const FUNNEL_STAGE = {
  LANDING: 'landing',
  AUTH: 'auth',
  DASHBOARD: 'dashboard',
  SITE_CREATION: 'site_creation',
  EDITOR: 'editor',
  PUBLISH: 'publish',
  SETTINGS: 'settings',
} as const;

export const EVENTS = {
  // Landing
  LANDING_PAGE_VIEWED: 'landing_page_viewed',
  LANDING_CTA_CLICKED: 'landing_cta_clicked',
  LANDING_SCROLL_DEPTH: 'landing_scroll_depth',
  LANDING_FAQ_OPENED: 'landing_faq_opened',
  LANDING_CONTACT_SUBMITTED: 'landing_contact_submitted',
  LANDING_NAV_CLICKED: 'landing_nav_clicked',
  // Auth
  AUTH_FORM_VIEWED: 'auth_form_viewed',
  AUTH_FORM_SUBMITTED: 'auth_form_submitted',
  AUTH_SUCCESS: 'auth_success',
  AUTH_ERROR: 'auth_error',
  AUTH_MODE_TOGGLED: 'auth_mode_toggled',
  AUTH_PASSWORD_RESET_REQUESTED: 'auth_password_reset_requested',
  // Dashboard
  DASHBOARD_VIEWED: 'dashboard_viewed',
  SITES_LIST_VIEWED: 'sites_list_viewed',
  CREATE_SITE_CTA_CLICKED: 'create_site_cta_clicked',
  SITE_CARD_CLICKED: 'site_card_clicked',
  // Site creation
  NEW_SITE_PAGE_VIEWED: 'new_site_page_viewed',
  TEMPLATE_SELECTED: 'template_selected',
  SITE_CREATION_COMPLETED: 'site_creation_completed',
  SITE_CREATION_FAILED: 'site_creation_failed',
  // Editor
  EDITOR_OPENED: 'editor_opened',
  SECTION_ADDED: 'section_added',
  SECTION_DELETED: 'section_deleted',
  PUBLISH_CLICKED: 'publish_clicked',
  PUBLISH_SUCCESS: 'publish_success',
  PUBLISH_FAILED: 'publish_failed',
  // Errors
  UNHANDLED_ERROR: 'unhandled_error',
  API_ERROR: 'api_error',
} as const;

const isDev = process.env.NODE_ENV === 'development';

class Analytics {
  private provider: AnalyticsProvider | null = null;
  private queue: QueuedEvent[] = [];

  setProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
    this.flushQueue();
  }

  private flushQueue(): void {
    if (!this.provider) return;
    for (const event of this.queue) {
      if (event.type === 'track') this.provider.track(event.args[0], event.args[1]);
      else if (event.type === 'page') this.provider.page(event.args[0], event.args[1]);
      else if (event.type === 'identify') this.provider.identify(event.args[0], event.args[1]);
    }
    this.queue = [];
  }

  trackEvent(name: string, properties?: EventProperties): void {
    const enriched: EventProperties = {
      ...properties,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };
    if (isDev) {
      console.log(`%c[Analytics] ${name}`, 'color: #6366f1; font-weight: bold;', enriched);
    }
    if (this.provider) {
      this.provider.track(name, enriched);
    } else {
      this.queue.push({ type: 'track', args: [name, enriched], timestamp: Date.now() });
    }
  }

  trackPageView(page: string, properties?: EventProperties): void {
    if (isDev) {
      console.log(`%c[Analytics] pageview: ${page}`, 'color: #06b6d4; font-weight: bold;', properties);
    }
    if (this.provider) {
      this.provider.page(page, properties);
    } else {
      this.queue.push({ type: 'page', args: [page, properties], timestamp: Date.now() });
    }
  }

  identifyUser(userId: string, traits?: EventProperties): void {
    if (isDev) {
      console.log(`%c[Analytics] identify: ${userId}`, 'color: #22c55e; font-weight: bold;', traits);
    }
    if (this.provider) {
      this.provider.identify(userId, traits);
    } else {
      this.queue.push({ type: 'identify', args: [userId, traits], timestamp: Date.now() });
    }
  }
}

export const analytics = new Analytics();

/** Track scroll depth on a page. Returns cleanup function. */
export function trackScrollDepth(stage: string = FUNNEL_STAGE.LANDING): () => void {
  if (typeof window === 'undefined') return () => {};
  const thresholds = [25, 50, 75, 100];
  const reached = new Set<number>();
  const handler = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((window.scrollY / docHeight) * 100);
    for (const t of thresholds) {
      if (pct >= t && !reached.has(t)) {
        reached.add(t);
        analytics.trackEvent(EVENTS.LANDING_SCROLL_DEPTH, { depth_percent: t, funnel_stage: stage });
      }
    }
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

/** Attach global error tracking. Returns cleanup function. */
export function initErrorTracking(): () => void {
  if (typeof window === 'undefined') return () => {};
  const onError = (event: ErrorEvent) => {
    analytics.trackEvent(EVENTS.UNHANDLED_ERROR, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
    });
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    analytics.trackEvent(EVENTS.UNHANDLED_ERROR, {
      message: event.reason instanceof Error ? event.reason.message : String(event.reason),
    });
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}

/** Track an API error for analytics. */
export function trackApiError(endpoint: string, statusCode: number | string, message?: string): void {
  analytics.trackEvent(EVENTS.API_ERROR, {
    endpoint,
    status_code: String(statusCode),
    message: message?.slice(0, 200),
  });
}
