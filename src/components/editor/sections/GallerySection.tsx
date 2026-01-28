import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Image as ImageIcon, Plus, Trash2, ZoomIn, Camera, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect, useCallback } from 'react';
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

const DEFAULT_IMAGES: GalleryImage[] = [
  { src: '', alt: 'תמונה 1', caption: 'פרויקט ראשון' },
  { src: '', alt: 'תמונה 2', caption: 'פרויקט שני' },
  { src: '', alt: 'תמונה 3', caption: 'פרויקט שלישי' },
  { src: '', alt: 'תמונה 4', caption: 'פרויקט רביעי' },
  { src: '', alt: 'תמונה 5', caption: 'פרויקט חמישי' },
  { src: '', alt: 'תמונה 6', caption: 'פרויקט שישי' },
];

// ──────────────────────────────────────────────
// Shared image cell used by grid / lightbox
// ──────────────────────────────────────────────
function ImageCell({
  image,
  index,
  isEditing,
  onUpdateImage,
  onRemoveImage,
  cardRadius,
  overlay,
  className = '',
  style,
}: {
  image: GalleryImage;
  index: number;
  isEditing?: boolean;
  onUpdateImage: (index: number, url: string) => void;
  onRemoveImage: (index: number) => void;
  cardRadius: string;
  overlay: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={{ borderRadius: cardRadius, ...style }}
    >
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

      {/* variant-specific overlay */}
      {overlay}

      {/* Edit controls */}
      {isEditing && (
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
          <ImagePickerDialog
            onSelect={(url) => onUpdateImage(index, url)}
            currentImage={image.src}
          >
            <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
              <ImageIcon className="h-4 w-4 ml-1" />
              {image.src ? 'החלף' : 'בחר'}
            </Button>
          </ImagePickerDialog>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage(index);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Add-image placeholder tile
// ──────────────────────────────────────────────
function AddImageTile({
  onAdd,
  cardRadius,
  className = '',
}: {
  onAdd: (url: string) => void;
  cardRadius: string;
  className?: string;
}) {
  return (
    <ImagePickerDialog onSelect={onAdd}>
      <div
        className={`border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group ${className}`}
        style={{ borderRadius: cardRadius }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
          הוסף תמונה
        </span>
      </div>
    </ImagePickerDialog>
  );
}

// ══════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════
export function GallerySection({
  content,
  variant = 'default',
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const galleryContent = content as GalleryContent;
  const images = galleryContent.images || [];
  const displayImages = images.length > 0 ? images : DEFAULT_IMAGES;
  const visibleImages = isEditing ? images : displayImages;

  const { colors, fonts, getCardRadius, getButtonRadius } = useTheme();
  const cardRadius = getCardRadius();
  const buttonRadius = getButtonRadius();

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keep carousel index in bounds
  useEffect(() => {
    if (activeCarouselIndex >= visibleImages.length && visibleImages.length > 0) {
      setActiveCarouselIndex(0);
    }
  }, [visibleImages.length, activeCarouselIndex]);

  // ── content helpers ──
  const updateContent = (key: keyof GalleryContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], src: url };
    updateContent('images', newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
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

  const goCarousel = useCallback(
    (dir: 1 | -1) => {
      setActiveCarouselIndex((prev) => {
        const len = visibleImages.length;
        if (len === 0) return 0;
        return (prev + dir + len) % len;
      });
    },
    [visibleImages.length],
  );

  // ── section header (shared) ──
  const SectionHeader = (
    <div
      className={`text-center mb-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
        style={{
          backgroundColor: `${colors.primary}15`,
          color: colors.primary,
          borderRadius: buttonRadius,
        }}
      >
        <Camera className="w-4 h-4" />
        <span>העבודות שלנו</span>
      </div>
      <EditableText
        value={galleryContent.title || 'הגלריה שלנו'}
        onChange={(value) => updateContent('title', value)}
        isEditing={isEditing}
        className="text-4xl md:text-5xl font-bold mb-4"
        as="h2"
        style={{ fontFamily: fonts.heading }}
      />
      <EditableText
        value={galleryContent.subtitle || 'מבחר מהעבודות האחרונות שלנו'}
        onChange={(value) => updateContent('subtitle', value)}
        isEditing={isEditing}
        className="text-xl text-muted-foreground max-w-2xl mx-auto"
        as="p"
        style={{ fontFamily: fonts.body }}
      />
    </div>
  );

  // wrapper props shared by every variant
  const sectionProps = {
    ref: sectionRef,
    className: `relative py-32 px-4 overflow-hidden transition-all ${
      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`,
    onClick: onSelect,
    style: { fontFamily: fonts.body } as React.CSSProperties,
  };

  // ─────────────────────────────────────────────
  // VARIANT: MASONRY
  // ─────────────────────────────────────────────
  if (variant === 'masonry') {
    // Masonry pattern: cycle of different span combinations
    const masonryPatterns = [
      'col-span-2 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
    ];

    return (
      <section {...sectionProps}>
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}08 0%, transparent 50%, ${colors.primary}06 100%)`,
          }}
        />
        <div
          className="absolute top-10 left-10 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.accent }}
        />

        <div className="relative max-w-7xl mx-auto">
          {SectionHeader}

          <div className="grid grid-cols-3 md:grid-cols-4 auto-rows-[160px] gap-3">
            {visibleImages.map((image, index) => {
              const pattern = masonryPatterns[index % masonryPatterns.length];
              return (
                <div
                  key={index}
                  className={`${pattern} transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <ImageCell
                    image={image}
                    index={index}
                    isEditing={isEditing}
                    onUpdateImage={updateImage}
                    onRemoveImage={removeImage}
                    cardRadius="4px"
                    className="w-full h-full"
                    overlay={
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          background: `linear-gradient(to top, ${colors.primary}CC 0%, transparent 60%)`,
                        }}
                      >
                        <div className="absolute bottom-3 left-3 right-3">
                          {isEditing ? (
                            <EditableText
                              value={image.caption || ''}
                              onChange={(v) => updateCaption(index, v)}
                              isEditing={isEditing}
                              className="text-white text-sm font-medium"
                              as="p"
                              placeholder="הוסף כיתוב..."
                            />
                          ) : (
                            image.caption && (
                              <p className="text-white text-sm font-medium">{image.caption}</p>
                            )
                          )}
                        </div>
                      </div>
                    }
                  />
                </div>
              );
            })}

            {isEditing && (
              <AddImageTile onAdd={addImage} cardRadius="4px" className="aspect-square min-h-[160px]" />
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // VARIANT: CAROUSEL
  // ─────────────────────────────────────────────
  if (variant === 'carousel') {
    const currentImage = visibleImages[activeCarouselIndex] || { src: '', alt: '', caption: '' };

    return (
      <section {...sectionProps}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10"
          style={{
            background: `linear-gradient(to top, ${colors.primary}, transparent)`,
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {SectionHeader}

          {visibleImages.length > 0 ? (
            <>
              {/* Main display */}
              <div
                className={`relative w-full aspect-video mb-6 overflow-hidden transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ borderRadius: cardRadius }}
              >
                {currentImage.src ? (
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt || ''}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted via-muted/50 to-primary/10">
                    <ImageIcon className="w-20 h-20 text-muted-foreground/20" />
                  </div>
                )}

                {/* Caption overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  }}
                >
                  {isEditing ? (
                    <EditableText
                      value={currentImage.caption || ''}
                      onChange={(v) => updateCaption(activeCarouselIndex, v)}
                      isEditing={isEditing}
                      className="text-white text-lg font-medium"
                      as="p"
                      placeholder="הוסף כיתוב..."
                    />
                  ) : (
                    currentImage.caption && (
                      <p className="text-white text-lg font-medium">{currentImage.caption}</p>
                    )
                  )}
                </div>

                {/* Navigation arrows */}
                {visibleImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        goCarousel(-1);
                      }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        goCarousel(1);
                      }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Edit controls for the main image */}
                {isEditing && (
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <ImagePickerDialog
                      onSelect={(url) => updateImage(activeCarouselIndex, url)}
                      currentImage={currentImage.src}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                        style={{ borderRadius: buttonRadius }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ImageIcon className="h-4 w-4 ml-1" />
                        {currentImage.src ? 'החלף' : 'בחר'}
                      </Button>
                    </ImagePickerDialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      style={{ borderRadius: buttonRadius }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(activeCarouselIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Counter badge */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-sm"
                  style={{ borderRadius: buttonRadius }}
                >
                  {activeCarouselIndex + 1} / {visibleImages.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                {visibleImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCarouselIndex(idx);
                    }}
                    className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-300 ${
                      idx === activeCarouselIndex
                        ? 'ring-2 scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      borderRadius: '6px',
                      ringColor: colors.primary,
                      ...(idx === activeCarouselIndex
                        ? { boxShadow: `0 0 0 2px ${colors.primary}` }
                        : {}),
                    }}
                  >
                    {img.src ? (
                      <img
                        src={img.src}
                        alt={img.alt || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">אין תמונות בגלריה</p>
          )}

          {/* Add image (edit mode) */}
          {isEditing && (
            <div className="mt-6 flex justify-center">
              <ImagePickerDialog onSelect={addImage}>
                <Button
                  variant="outline"
                  style={{ borderRadius: buttonRadius }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף תמונה
                </Button>
              </ImagePickerDialog>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // VARIANT: LIGHTBOX
  // ─────────────────────────────────────────────
  if (variant === 'lightbox') {
    return (
      <section {...sectionProps}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
        <div
          className="absolute top-40 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: colors.accent }}
        />

        <div className="relative max-w-7xl mx-auto">
          {SectionHeader}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden cursor-pointer group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  borderRadius: cardRadius,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                {image.src ? (
                  <img
                    src={image.src}
                    alt={image.alt || ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}

                {/* Darkening overlay + zoom icon */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform duration-300"
                    style={{
                      backgroundColor: `${colors.primary}CC`,
                      transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.5)',
                    }}
                  >
                    <ZoomIn className="w-7 h-7 text-white" />
                  </div>

                  {/* Caption on hover */}
                  <div className="px-4 text-center">
                    {isEditing ? (
                      <EditableText
                        value={image.caption || ''}
                        onChange={(v) => updateCaption(index, v)}
                        isEditing={isEditing}
                        className="text-white text-sm"
                        as="p"
                        placeholder="הוסף כיתוב..."
                      />
                    ) : (
                      image.caption && (
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      )
                    )}
                  </div>
                </div>

                {/* Coloured border ring on hover */}
                <div
                  className={`absolute inset-0 ring-2 ring-inset transition-opacity duration-300 pointer-events-none ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    borderRadius: cardRadius,
                    boxShadow: hoveredIndex === index ? `inset 0 0 0 2px ${colors.primary}` : 'none',
                  }}
                />

                {/* Edit controls */}
                {isEditing && (
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                    <ImagePickerDialog
                      onSelect={(url) => updateImage(index, url)}
                      currentImage={image.src}
                    >
                      <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
                        <ImageIcon className="h-4 w-4 ml-1" />
                        {image.src ? 'החלף' : 'בחר'}
                      </Button>
                    </ImagePickerDialog>
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
                  </div>
                )}
              </div>
            ))}

            {isEditing && (
              <AddImageTile onAdd={addImage} cardRadius={cardRadius} className="aspect-square" />
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // VARIANT: DEFAULT (grid)
  // ─────────────────────────────────────────────
  return (
    <section {...sectionProps}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div
        className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: colors.accent }}
      />

      <div className="relative max-w-7xl mx-auto">
        {SectionHeader}

        {/* 4-column equal grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleImages.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden cursor-pointer group transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                borderRadius: cardRadius,
              }}
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

              {/* Hover overlay with zoom + caption */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                      hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                    }`}
                  >
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  {isEditing ? (
                    <EditableText
                      value={image.caption || ''}
                      onChange={(v) => updateCaption(index, v)}
                      isEditing={isEditing}
                      className="text-white text-sm font-medium"
                      as="p"
                      placeholder="הוסף כיתוב..."
                    />
                  ) : (
                    image.caption && (
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    )
                  )}
                </div>
              </div>

              {/* Border on hover */}
              <div
                className={`absolute inset-0 ring-2 ring-inset transition-opacity duration-300 pointer-events-none ${
                  hoveredIndex === index ? 'opacity-100 ring-white/30' : 'opacity-0 ring-transparent'
                }`}
                style={{ borderRadius: cardRadius }}
              />

              {/* Edit controls */}
              {isEditing && (
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <ImagePickerDialog
                    onSelect={(url) => updateImage(index, url)}
                    currentImage={image.src}
                  >
                    <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
                      <ImageIcon className="h-4 w-4 ml-1" />
                      {image.src ? 'החלף' : 'בחר'}
                    </Button>
                  </ImagePickerDialog>
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
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <AddImageTile onAdd={addImage} cardRadius={cardRadius} className="aspect-square" />
          )}
        </div>
      </div>
    </section>
  );
}
