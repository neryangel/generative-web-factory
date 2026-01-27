'use client';

import Sites from '@/views/Sites';
import { PageErrorBoundary } from '@/components/common/PageErrorBoundary';

export default function SitesPage() {
  return (
    <PageErrorBoundary pageName="האתרים שלי">
      <Sites />
    </PageErrorBoundary>
  );
}
