import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploaderProps {
  siteId?: string;
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  preview: string | null;
  error: string | null;
}

export function ImageUploader({
  siteId,
  onUploadComplete,
  currentImage,
  className,
  aspectRatio = 'auto',
}: ImageUploaderProps) {
  const { currentTenant } = useTenant();
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    preview: currentImage || null,
    error: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]',
    auto: 'min-h-[200px]',
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      void handleFileUpload(files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleFileUpload depends on the same deps
  }, [currentTenant, siteId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      void handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentTenant) {
      toast.error('שגיאה', {
        description: 'לא נמצא ארגון פעיל',
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setUploadState({
        status: 'error',
        progress: 0,
        preview: null,
        error: 'סוג קובץ לא נתמך. יש להעלות תמונה בפורמט JPG, PNG, GIF, WebP או SVG',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadState({
        status: 'error',
        progress: 0,
        preview: null,
        error: 'גודל הקובץ חורג מהמותר (מקסימום 5MB)',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadState(prev => ({
        ...prev,
        preview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Start upload
    setUploadState(prev => ({
      ...prev,
      status: 'uploading',
      progress: 0,
      error: null,
    }));

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = siteId 
        ? `${currentTenant.id}/${siteId}/${fileName}`
        : `${currentTenant.id}/general/${fileName}`;

      // Simulate progress for better UX
      progressIntervalRef.current = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      const { error } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setUploadState({
        status: 'success',
        progress: 100,
        preview: urlData.publicUrl,
        error: null,
      });

      // Save to assets table
      await supabase.from('assets').insert({
        tenant_id: currentTenant.id,
        site_id: siteId || null,
        filename: file.name,
        storage_path: filePath,
        mime_type: file.type,
        size_bytes: file.size,
      });

      onUploadComplete(urlData.publicUrl);

      toast.success('הועלה בהצלחה', {
        description: 'התמונה הועלתה בהצלחה',
      });

    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'שגיאה בהעלאת הקובץ';
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        progress: 0,
        error: message,
      }));

      toast.error('שגיאה בהעלאה', {
        description: message,
      });
    }
  };

  const handleRemoveImage = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
      preview: null,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative w-full rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden',
          aspectRatioClasses[aspectRatio],
          isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          uploadState.status === 'error' && 'border-destructive bg-destructive/5',
          uploadState.status === 'success' && 'border-success bg-success/5',
        )}
      >
        {/* Preview Image */}
        {uploadState.preview && (
          <img
            src={uploadState.preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay for states */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center p-4 transition-all',
            uploadState.preview 
              ? 'bg-black/50 opacity-0 hover:opacity-100' 
              : 'bg-transparent'
          )}
        >
          {uploadState.status === 'uploading' ? (
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="h-10 w-10 animate-spin" />
              <span className="text-sm font-medium">מעלה...</span>
              <Progress value={uploadState.progress} className="w-32 h-2" />
            </div>
          ) : uploadState.status === 'success' && uploadState.preview ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-sm">לחץ להחלפת תמונה</span>
            </div>
          ) : uploadState.status === 'error' ? (
            <div className="flex flex-col items-center gap-2 text-destructive text-center">
              <X className="h-8 w-8" />
              <span className="text-sm">{uploadState.error}</span>
            </div>
          ) : (
            <div className={cn(
              'flex flex-col items-center gap-2',
              uploadState.preview ? 'text-white' : 'text-muted-foreground'
            )}>
              {isDragOver ? (
                <>
                  <Upload className="h-10 w-10 animate-bounce" />
                  <span className="text-sm font-medium">שחרר כאן</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-sm">גרור תמונה או לחץ לבחירה</span>
                  <span className="text-xs opacity-75">JPG, PNG, GIF, WebP, SVG (מקס׳ 5MB)</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Remove button */}
        {uploadState.preview && uploadState.status !== 'uploading' && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
