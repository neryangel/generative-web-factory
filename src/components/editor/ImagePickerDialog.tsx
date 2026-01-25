import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageUploader } from './ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { ImageIcon, Upload, FolderOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePickerDialogProps {
  children: React.ReactNode;
  siteId?: string;
  onSelect: (url: string) => void;
  currentImage?: string;
}

interface Asset {
  id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  created_at: string;
}

export function ImagePickerDialog({
  children,
  siteId,
  onSelect,
  currentImage,
}: ImagePickerDialogProps) {
  const { currentTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentImage || null);

  const fetchAssets = async () => {
    if (!currentTenant) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('assets')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (siteId) {
        query = query.or(`site_id.eq.${siteId},site_id.is.null`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open, currentTenant]);

  const getPublicUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('assets').getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      setOpen(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    setSelectedUrl(url);
    fetchAssets(); // Refresh the library
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            בחירת תמונה
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              העלאה חדשה
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              ספריית מדיה
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <ImageUploader
              siteId={siteId}
              onUploadComplete={handleUploadComplete}
              currentImage={selectedUrl || undefined}
              aspectRatio="video"
            />
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mb-4" />
                <p>אין תמונות בספריה</p>
                <p className="text-sm">העלה תמונות חדשות בלשונית ״העלאה חדשה״</p>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="grid grid-cols-4 gap-3 p-1">
                  {assets.map((asset) => {
                    const url = getPublicUrl(asset.storage_path);
                    const isSelected = selectedUrl === url;
                    
                    return (
                      <button
                        key={asset.id}
                        onClick={() => handleSelect(url)}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                          isSelected 
                            ? 'border-primary ring-2 ring-primary/50' 
                            : 'border-transparent hover:border-muted-foreground/50'
                        )}
                      >
                        <img
                          src={url}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            ביטול
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedUrl}>
            בחר תמונה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
