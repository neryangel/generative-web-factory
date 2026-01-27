'use client';

import NewSite from '@/views/NewSite';
import { PageErrorBoundary } from '@/components/common/PageErrorBoundary';

export default function NewSitePage() {
  return (
    <PageErrorBoundary pageName="יצירת אתר חדש">
      <NewSite />
    </PageErrorBoundary>
  );
}
