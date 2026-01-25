import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  src?: string;
  alt?: string;
  caption?: string;
}

interface GalleryContent {
  title?: string;
  images?: GalleryImage[];
}

export function GallerySection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const galleryContent = content as GalleryContent;
  const images = galleryContent.images || [];

  const updateContent = (key: keyof GalleryContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], src: url };
    updateContent('images', newImages);
  };

  const addImage = (url: string) => {
    const newImages = [...images, { src: url, alt: `תמונה ${images.length + 1}`, caption: '' }];
    updateContent('images', newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateContent('images', newImages);
  };

  // Default placeholder images for display when no images
  const displayImages = images.length > 0 ? images : [
    { src: '', alt: 'תמונה 1', caption: '' },
    { src: '', alt: 'תמונה 2', caption: '' },
    { src: '', alt: 'תמונה 3', caption: '' },
    { src: '', alt: 'תמונה 4', caption: '' },
    { src: '', alt: 'תמונה 5', caption: '' },
    { src: '', alt: 'תמונה 6', caption: '' },
  ];

  return (
    <section 
      className={`py-20 px-4 transition-all bg-muted/30 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={galleryContent.title || 'הגלריה שלנו'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold"
            as="h2"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(isEditing ? images : displayImages).map((image, index) => (
            <div 
              key={index} 
              className="aspect-square rounded-xl overflow-hidden bg-muted group relative shadow-md"
            >
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt || ''} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <ImagePickerDialog
                    onSelect={(url) => updateImage(index, url)}
                    currentImage={image.src}
                  >
                    <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      {image.src ? 'החלף' : 'בחר'}
                    </Button>
                  </ImagePickerDialog>
                  
                  {images.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Image Button (Edit Mode) */}
          {isEditing && (
            <ImagePickerDialog onSelect={addImage}>
              <div 
                className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="h-8 w-8 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">הוסף תמונה</span>
              </div>
            </ImagePickerDialog>
          )}
        </div>
      </div>
    </section>
  );
}
