'use client';

import { use, useEffect } from 'react';
import SiteEditor from '@/views/SiteEditor';
import { PageErrorBoundary } from '@/components/common/PageErrorBoundary';

export default function SiteEditorPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);

  return (
    <PageErrorBoundary pageName="עורך האתר">
      <SiteEditorWrapper siteId={siteId} />
    </PageErrorBoundary>
  );
}

function SiteEditorWrapper({ siteId }: { siteId: string }) {
  // Ensure the URL matches the siteId for useParams compatibility
  // Done in useEffect to avoid hydration mismatch
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!currentPath.includes(siteId)) {
      window.history.replaceState(null, '', `/dashboard/sites/${siteId}`);
    }
  }, [siteId]);

  return <SiteEditor />;
}
