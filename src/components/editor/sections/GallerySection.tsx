import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Image as ImageIcon, Plus, Trash2, ZoomIn, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface GalleryImage {
  src?: string;
  alt?: string;
  caption?: string;
}

interface GalleryContent {
  title?: string;
  subtitle?: string;
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
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  // Masonry-like grid sizes
  const gridSizes = ['col-span-1 row-span-1', 'col-span-1 row-span-2', 'col-span-2 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-2 row-span-2'];

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Camera className="w-4 h-4" />
            <span>העבודות שלנו</span>
          </div>
          <EditableText
            value={galleryContent.title || 'הגלריה שלנו'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold mb-4"
            as="h2"
          />
          <EditableText
            value={galleryContent.subtitle || 'מבחר מהעבודות האחרונות שלנו'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {(isEditing ? images : displayImages).map((image, index) => {
            const gridClass = gridSizes[index % gridSizes.length];
            
            return (
              <div 
                key={index} 
                className={`${gridClass} relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                {image.src ? (
                  <img 
                    src={image.src} 
                    alt={image.alt || ''} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent/10">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>

                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl ring-2 ring-inset transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100 ring-white/30' : 'opacity-0 ring-transparent'}`} />
                
                {/* Edit mode overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <ImagePickerDialog
                      onSelect={(url) => updateImage(index, url)}
                      currentImage={image.src}
                    >
                      <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
                        <ImageIcon className="h-4 w-4 ml-1" />
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
            );
          })}

          {/* Add Image Button (Edit Mode) */}
          {isEditing && (
            <ImagePickerDialog onSelect={addImage}>
              <div 
                className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">הוסף תמונה</span>
              </div>
            </ImagePickerDialog>
          )}
        </div>
      </div>
    </section>
  );
}
