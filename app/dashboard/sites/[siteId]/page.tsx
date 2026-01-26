'use client';

import { use } from 'react';
import SiteEditor from '@/views/SiteEditor';

// Create a context-like wrapper to pass siteId to the existing component
export default function SiteEditorPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);

  // The existing SiteEditor uses useParams from react-router-dom
  // We need to provide the params through a different mechanism
  return <SiteEditorWrapper siteId={siteId} />;
}

function SiteEditorWrapper({ siteId }: { siteId: string }) {
  // Override the URL to include the siteId for react-router-dom compatibility
  // This works because SiteEditor uses useParams which reads from the URL
  if (typeof window !== 'undefined') {
    // Update browser history to make useParams work
    const currentPath = window.location.pathname;
    if (!currentPath.includes(siteId)) {
      window.history.replaceState(null, '', `/dashboard/sites/${siteId}`);
    }
  }

  return <SiteEditor />;
}
