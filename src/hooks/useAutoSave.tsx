import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface AutoSaveOptions {
  debounceMs?: number;
  maxRetries?: number;
  onSaveStart?: () => void;
  onSaveEnd?: () => void;
  onError?: (error: Error) => void;
}

type SaveableTable = 'sections' | 'pages' | 'sites';

interface SaveOperation {
  table: SaveableTable;
  id: string;
  data: Record<string, unknown>;
  version: number; // Track operation version for race condition prevention
  retryCount: number;
}

// Track the latest version for each entity to prevent stale updates
const entityVersions = new Map<string, number>();

function getEntityKey(table: string, id: string): string {
  return `${table}:${id}`;
}

function getNextVersion(key: string): number {
  const current = entityVersions.get(key) || 0;
  const next = current + 1;
  entityVersions.set(key, next);
  return next;
}

function isLatestVersion(key: string, version: number): boolean {
  const current = entityVersions.get(key) || 0;
  return version >= current;
}

export function useAutoSave(options: AutoSaveOptions = {}) {
  const { debounceMs = 1500, maxRetries = 2, onSaveStart, onSaveEnd, onError } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const pendingOperations = useRef<Map<string, SaveOperation>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveInProgressRef = useRef(false);

  const flushSave = useCallback(async () => {
    // Prevent concurrent flush operations
    if (saveInProgressRef.current || pendingOperations.current.size === 0) return;

    saveInProgressRef.current = true;
    const operations = Array.from(pendingOperations.current.values());
    pendingOperations.current.clear();
    setPendingCount(0);

    setIsSaving(true);
    onSaveStart?.();

    const failedOperations: SaveOperation[] = [];

    try {
      // Group operations by table for batch updates
      const grouped = operations.reduce((acc, op) => {
        if (!acc[op.table]) acc[op.table] = [];
        acc[op.table].push(op);
        return acc;
      }, {} as Record<SaveableTable, SaveOperation[]>);

      for (const [table, ops] of Object.entries(grouped)) {
        for (const op of ops) {
          const key = getEntityKey(op.table, op.id);

          // Skip stale operations (newer version already queued)
          if (!isLatestVersion(key, op.version)) {
            logger.log(`[AutoSave] Skipping stale operation for ${key} (v${op.version})`);
            continue;
          }

          try {
            const { error } = await supabase
              .from(table as SaveableTable)
              .update(op.data)
              .eq('id', op.id);

            if (error) {
              throw error;
            }
          } catch (error) {
            console.error(`[AutoSave] Error saving ${key}:`, error);

            // Queue for retry if under max retries
            if (op.retryCount < maxRetries) {
              failedOperations.push({
                ...op,
                retryCount: op.retryCount + 1,
              });
            } else {
              // Max retries exceeded - notify user
              const saveError = error instanceof Error ? error : new Error('Save failed');
              onError?.(saveError);
              toast.error('שמירה אוטומטית נכשלה. נסה לשמור שוב.');
            }
          }
        }
      }

      // Re-queue failed operations for retry
      if (failedOperations.length > 0) {
        for (const op of failedOperations) {
          const key = getEntityKey(op.table, op.id);
          pendingOperations.current.set(key, op);
        }
        setPendingCount(failedOperations.length);

        // Schedule retry after a delay
        timeoutRef.current = setTimeout(flushSave, debounceMs * 2);
      } else {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('[AutoSave] Unexpected error:', error);
      onError?.(error as Error);
      toast.error('שגיאה בשמירה אוטומטית');
    } finally {
      saveInProgressRef.current = false;
      setIsSaving(false);
      onSaveEnd?.();
    }
  }, [debounceMs, maxRetries, onSaveStart, onSaveEnd, onError]);

  const queueSave = useCallback((operation: Omit<SaveOperation, 'version' | 'retryCount'>) => {
    const key = getEntityKey(operation.table, operation.id);
    const version = getNextVersion(key);

    // Always use the latest data, overwriting any pending operation
    pendingOperations.current.set(key, {
      ...operation,
      version,
      retryCount: 0,
    });
    setPendingCount(pendingOperations.current.size);

    // Debounce the save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(flushSave, debounceMs);
  }, [debounceMs, flushSave]);

  const saveSection = useCallback((sectionId: string, content: Record<string, unknown>, settings?: Record<string, unknown>) => {
    queueSave({
      table: 'sections',
      id: sectionId,
      data: {
        content,
        ...(settings && { settings }),
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  const savePage = useCallback((pageId: string, data: Record<string, unknown>) => {
    queueSave({
      table: 'pages',
      id: pageId,
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  const saveSite = useCallback((siteId: string, data: Record<string, unknown>) => {
    queueSave({
      table: 'sites',
      id: siteId,
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    });
  }, [queueSave]);

  // Flush on unmount - fire and forget since we can't await in cleanup
  useEffect(() => {
    const pendingRef = pendingOperations.current;
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Best-effort save on unmount. flushSave is async but cleanup
      // can't await it. The promise will still execute in the background.
      if (pendingRef.size > 0) {
        flushSave().catch((err: unknown) => {
          console.error('[AutoSave] Failed to flush on unmount:', err);
        });
      }
    };
  }, [flushSave]);

  return {
    isSaving,
    lastSaved,
    pendingCount,
    saveSection,
    savePage,
    saveSite,
    flushSave,
  };
}
