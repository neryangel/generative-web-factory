import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Image as ImageIcon } from 'lucide-react';

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

  // Default placeholder images
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
      className={`py-20 px-4 transition-all ${
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
          {displayImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square rounded-xl overflow-hidden bg-muted group relative"
            >
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt || ''} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">לחץ להחלפת תמונה</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
