import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Testimonial {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: string;
  rating?: number;
  company?: string;
}

interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  items?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: 'הפלטפורמה הזו שינתה את הדרך שבה אנחנו מנהלים את הנוכחות הדיגיטלית שלנו. פשוט מדהים!',
    author: 'שרה כהן',
    role: 'מנכ"לית',
    company: 'חברת טכנולוגיה',
    rating: 5,
  },
  {
    quote: 'בזכות הכלים המתקדמים הצלחנו להכפיל את המכירות שלנו תוך חודשיים בלבד. ממליץ בחום!',
    author: 'דני לוי',
    role: 'בעל עסק',
    company: 'חנות אונליין',
    rating: 5,
  },
  {
    quote: 'השירות והתמיכה ברמה אחרת לגמרי. כל שאלה נענית במהירות ובמקצועיות.',
    author: 'מיכל אברהם',
    role: 'מעצבת גרפית',
    company: 'סטודיו עיצוב',
    rating: 5,
  },
  {
    quote: 'ממשק נוח ואינטואיטיבי שמאפשר לנו להתמקד בעסק ולא בטכנולוגיה. חוסך לנו שעות עבודה.',
    author: 'יוסי מזרחי',
    role: 'סמנכ"ל שיווק',
    company: 'קבוצת מדיה',
    rating: 4,
  },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StarRating({
  rating,
  accentColor,
  isEditing,
  onChange,
  size = 'w-5 h-5',
}: {
  rating: number;
  accentColor: string;
  isEditing?: boolean;
  onChange?: (val: number) => void;
  size?: string;
}) {
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? '' : 'text-white/20'
          } ${isEditing ? 'cursor-pointer' : ''}`}
          style={
            star <= rating
              ? { fill: accentColor, color: accentColor }
              : {}
          }
          onClick={
            isEditing
              ? (e) => {
                  e.stopPropagation();
                  onChange?.(star);
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

function AvatarCircle({
  author,
  colors,
  sizeClass = 'w-16 h-16',
  textSize = 'text-xl',
}: {
  author?: string;
  colors: { primary: string; accent: string };
  sizeClass?: string;
  textSize?: string;
}) {
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white ${textSize} font-bold flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      }}
    >
      {author?.charAt(0) || 'A'}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function TestimonialsSection({
  content,
  variant,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const testimonialsContent = content as TestimonialsContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();

  const testimonials =
    testimonialsContent.items?.length
      ? testimonialsContent.items
      : defaultTestimonials;

  // Intersection observer for entrance animations
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keep activeIndex in bounds
  useEffect(() => {
    if (activeIndex >= testimonials.length) {
      setActiveIndex(Math.max(0, testimonials.length - 1));
    }
  }, [testimonials.length, activeIndex]);

  // ── Content helpers ───────────────────────────────────────────────────────

  const updateContent = useCallback(
    (key: keyof TestimonialsContent, value: unknown) => {
      onContentChange?.({ ...content, [key]: value });
    },
    [content, onContentChange]
  );

  const updateItem = useCallback(
    (index: number, field: keyof Testimonial, value: string | number) => {
      const items = [...(testimonialsContent.items || defaultTestimonials)];
      items[index] = { ...items[index], [field]: value };
      updateContent('items', items);
    },
    [testimonialsContent.items, updateContent]
  );

  const addItem = useCallback(() => {
    const items = [...(testimonialsContent.items || defaultTestimonials)];
    items.push({
      quote: 'חוויה מצוינת! ממליץ לכולם.',
      author: 'לקוח חדש',
      role: 'תפקיד',
      company: 'חברה',
      rating: 5,
    });
    updateContent('items', items);
  }, [testimonialsContent.items, updateContent]);

  const removeItem = useCallback(
    (index: number) => {
      const items = [...(testimonialsContent.items || defaultTestimonials)];
      if (items.length <= 1) return;
      items.splice(index, 1);
      updateContent('items', items);
    },
    [testimonialsContent.items, updateContent]
  );

  // ── Choose variant ────────────────────────────────────────────────────────

  const resolvedVariant = variant || 'default';

  // ── Shared section wrapper ────────────────────────────────────────────────

  const wrapSection = (children: React.ReactNode, extraClass = '') => (
    <section
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${extraClass}`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
      dir="rtl"
    >
      {children}
    </section>
  );

  // ── Shared section header ─────────────────────────────────────────────────

  const renderHeader = (badge?: string) => (
    <div
      className={`text-center mb-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {badge && (
        <div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 text-sm font-medium mb-6"
          style={{ borderRadius: getButtonRadius() }}
        >
          <Star
            className="w-4 h-4"
            style={{ fill: colors.accent, color: colors.accent }}
          />
          <span>{badge}</span>
        </div>
      )}
      <EditableText
        value={testimonialsContent.title || 'לקוחות מרוצים מספרים'}
        onChange={(value) => updateContent('title', value)}
        isEditing={isEditing}
        className="text-4xl md:text-5xl font-bold text-white mb-4"
        as="h2"
        style={{ fontFamily: fonts.heading }}
      />
      <EditableText
        value={
          testimonialsContent.subtitle ||
          'הצטרפו לאלפי העסקים שכבר בחרו בנו'
        }
        onChange={(value) => updateContent('subtitle', value)}
        isEditing={isEditing}
        className="text-xl text-white/60 max-w-2xl mx-auto"
        as="p"
      />
    </div>
  );

  // ── Add / Remove buttons ──────────────────────────────────────────────────

  const renderAddButton = () =>
    isEditing ? (
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            addItem();
          }}
          className="gap-2 border-white/20 text-white hover:bg-white/10"
          style={{ borderRadius: getButtonRadius() }}
        >
          <Plus className="w-4 h-4" />
          <span>הוסף ביקורת</span>
        </Button>
      </div>
    ) : null;

  const renderRemoveButton = (index: number) =>
    isEditing && testimonials.length > 1 ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeItem(index);
        }}
        className="absolute top-3 left-3 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="הסר ביקורת"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    ) : null;

  // ════════════════════════════════════════════════════════════════════════════
  //  VARIANT: default  (carousel with auto-play, dots, single focus)
  // ════════════════════════════════════════════════════════════════════════════

  if (resolvedVariant === 'default') {
    return <DefaultVariant />;
  }

  function DefaultVariant() {
    // Auto-play
    useEffect(() => {
      if (isEditing) return;
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const nextSlide = () =>
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const prevSlide = () =>
      setActiveIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );

    return wrapSection(
      <>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar" />
        <div
          className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.primary}25` }}
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accent}15` }}
        />

        <div className="relative max-w-6xl mx-auto">
          {renderHeader('מה הלקוחות אומרים')}

          <div
            className={`relative transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Main testimonial card */}
            <div className="relative max-w-4xl mx-auto group">
              {renderRemoveButton(activeIndex)}
              <Card
                className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl"
                style={{ borderRadius: getCardRadius() }}
              >
                <div className="absolute -top-6 -right-6 text-[150px] leading-none font-serif text-white/5 select-none">
                  &ldquo;
                </div>

                <CardContent className="relative p-10 md:p-14">
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Avatar with animated ring */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="absolute -inset-1 rounded-full"
                        style={{
                          animation: 'spin 8s linear infinite',
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.accent}, ${colors.primary})`,
                        }}
                      />
                      <AvatarCircle
                        author={testimonials[activeIndex].author}
                        colors={colors}
                        sizeClass="relative w-28 h-28 border-4 border-sidebar"
                        textSize="text-3xl"
                      />
                    </div>

                    <div className="flex-1 text-center md:text-right">
                      <div className="flex justify-center md:justify-start mb-6">
                        <StarRating
                          rating={testimonials[activeIndex].rating || 5}
                          accentColor={colors.accent}
                          isEditing={isEditing}
                          onChange={(val) =>
                            updateItem(activeIndex, 'rating', val)
                          }
                        />
                      </div>

                      <EditableText
                        value={
                          testimonials[activeIndex].quote ||
                          'ביקורת מרשימה כאן'
                        }
                        onChange={(value) =>
                          updateItem(activeIndex, 'quote', value)
                        }
                        isEditing={isEditing}
                        className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-light"
                        as="p"
                      />

                      <div>
                        <EditableText
                          value={
                            testimonials[activeIndex].author || 'שם הלקוח'
                          }
                          onChange={(value) =>
                            updateItem(activeIndex, 'author', value)
                          }
                          isEditing={isEditing}
                          className="text-lg font-bold text-white"
                          as="p"
                        />
                        <div className="flex items-center justify-center md:justify-start gap-2 text-white/50">
                          <EditableText
                            value={testimonials[activeIndex].role || 'תפקיד'}
                            onChange={(value) =>
                              updateItem(activeIndex, 'role', value)
                            }
                            isEditing={isEditing}
                            as="span"
                          />
                          <span>&#x2022;</span>
                          <EditableText
                            value={
                              testimonials[activeIndex].company || 'חברה'
                            }
                            onChange={(value) =>
                              updateItem(activeIndex, 'company', value)
                            }
                            isEditing={isEditing}
                            as="span"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  style={
                    index === activeIndex
                      ? { backgroundColor: colors.primary }
                      : {}
                  }
                />
              ))}
            </div>

            {/* Mini preview row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`p-6 text-right transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-white/15 border-2'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                  style={{
                    borderRadius: getCardRadius(),
                    borderColor:
                      index === activeIndex
                        ? `${colors.primary}50`
                        : 'transparent',
                  }}
                >
                  <Quote className="w-6 h-6 text-white/30 mb-3" />
                  <p className="text-white/60 text-sm line-clamp-2 mb-3">
                    {testimonial.quote?.substring(0, 60)}...
                  </p>
                  <p className="text-white text-sm font-medium">
                    {testimonial.author}
                  </p>
                </button>
              ))}
            </div>

            {renderAddButton()}
          </div>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  VARIANT: grid  (2x2 / 3-col grid, glass-dark cards with borders)
  // ════════════════════════════════════════════════════════════════════════════

  if (resolvedVariant === 'grid') {
    return <GridVariant />;
  }

  function GridVariant() {
    return wrapSection(
      <>
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#1e293b]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {renderHeader('ביקורות לקוחות')}

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-6 backdrop-blur-md bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
                style={{
                  borderRadius: getCardRadius(),
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                {renderRemoveButton(index)}

                {/* Stars */}
                <div className="mb-4">
                  <StarRating
                    rating={testimonial.rating || 5}
                    accentColor={colors.accent}
                    isEditing={isEditing}
                    onChange={(val) => updateItem(index, 'rating', val)}
                    size="w-4 h-4"
                  />
                </div>

                {/* Quote */}
                <EditableText
                  value={testimonial.quote || 'ביקורת כאן'}
                  onChange={(value) => updateItem(index, 'quote', value)}
                  isEditing={isEditing}
                  className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-4"
                  as="p"
                />

                {/* Author row */}
                <div className="flex items-center gap-3 mt-auto">
                  <AvatarCircle
                    author={testimonial.author}
                    colors={colors}
                    sizeClass="w-10 h-10"
                    textSize="text-sm"
                  />
                  <div className="min-w-0">
                    <EditableText
                      value={testimonial.author || 'שם'}
                      onChange={(value) => updateItem(index, 'author', value)}
                      isEditing={isEditing}
                      className="text-white text-sm font-semibold truncate"
                      as="p"
                    />
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <EditableText
                        value={testimonial.role || 'תפקיד'}
                        onChange={(value) => updateItem(index, 'role', value)}
                        isEditing={isEditing}
                        as="span"
                        className="text-xs"
                      />
                      {testimonial.company && (
                        <>
                          <span>&#x2022;</span>
                          <EditableText
                            value={testimonial.company}
                            onChange={(value) =>
                              updateItem(index, 'company', value)
                            }
                            isEditing={isEditing}
                            as="span"
                            className="text-xs"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative accent line at top */}
                <div
                  className="absolute top-0 left-6 right-6 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to left, transparent, ${colors.primary}, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>

          {renderAddButton()}
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  VARIANT: cards  (large editorial/magazine stacked cards, big quote marks)
  // ════════════════════════════════════════════════════════════════════════════

  if (resolvedVariant === 'cards') {
    return <CardsVariant />;
  }

  function CardsVariant() {
    return wrapSection(
      <>
        {/* Warm dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1523] via-[#15101e] to-[#0d0a12]" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: colors.primary }}
        />

        <div className="relative max-w-4xl mx-auto">
          {renderHeader()}

          <div
            className={`flex flex-col gap-10 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  transitionDelay: `${index * 120}ms`,
                }}
              >
                {renderRemoveButton(index)}

                <Card
                  className="relative overflow-hidden bg-white/[0.03] border-white/[0.06] shadow-xl hover:shadow-2xl hover:bg-white/[0.05] transition-all duration-500"
                  style={{ borderRadius: getCardRadius() }}
                >
                  <CardContent className="p-10 md:p-14">
                    {/* Large decorative quote mark */}
                    <Quote
                      className="w-14 h-14 mb-6 opacity-30"
                      style={{ color: colors.primary }}
                    />

                    {/* Stars */}
                    <div className="mb-6">
                      <StarRating
                        rating={testimonial.rating || 5}
                        accentColor={colors.accent}
                        isEditing={isEditing}
                        onChange={(val) => updateItem(index, 'rating', val)}
                        size="w-5 h-5"
                      />
                    </div>

                    {/* Quote text -- large editorial */}
                    <EditableText
                      value={testimonial.quote || 'ביקורת כאן'}
                      onChange={(value) => updateItem(index, 'quote', value)}
                      isEditing={isEditing}
                      className="text-2xl md:text-3xl text-white/90 leading-relaxed font-light mb-10"
                      as="p"
                      style={{ fontFamily: fonts.heading }}
                    />

                    {/* Divider */}
                    <div
                      className="w-16 h-[2px] mb-8"
                      style={{
                        background: `linear-gradient(to left, transparent, ${colors.primary})`,
                      }}
                    />

                    {/* Author info -- horizontal layout */}
                    <div className="flex items-center gap-5">
                      <AvatarCircle
                        author={testimonial.author}
                        colors={colors}
                        sizeClass="w-14 h-14"
                        textSize="text-lg"
                      />
                      <div>
                        <EditableText
                          value={testimonial.author || 'שם'}
                          onChange={(value) =>
                            updateItem(index, 'author', value)
                          }
                          isEditing={isEditing}
                          className="text-lg font-bold text-white"
                          as="p"
                        />
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <EditableText
                            value={testimonial.role || 'תפקיד'}
                            onChange={(value) =>
                              updateItem(index, 'role', value)
                            }
                            isEditing={isEditing}
                            as="span"
                            className="text-sm"
                          />
                          {testimonial.company && (
                            <>
                              <span>&#x2022;</span>
                              <EditableText
                                value={testimonial.company}
                                onChange={(value) =>
                                  updateItem(index, 'company', value)
                                }
                                isEditing={isEditing}
                                as="span"
                                className="text-sm"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accent side strip */}
                <div
                  className="absolute top-8 bottom-8 right-0 w-[3px] opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`,
                    borderRadius: '2px',
                  }}
                />
              </div>
            ))}
          </div>

          {renderAddButton()}
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  VARIANT: single  (one large centered testimonial, click to navigate)
  // ════════════════════════════════════════════════════════════════════════════

  // Default fallback = single
  return <SingleVariant />;

  function SingleVariant() {
    const current = testimonials[activeIndex] || testimonials[0];

    const goNext = () =>
      setActiveIndex((prev) => (prev + 1) % testimonials.length);

    return wrapSection(
      <>
        {/* Minimal dark background */}
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        {/* Subtle radial spotlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {renderHeader()}

          <div
            className={`flex flex-col items-center transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Large avatar */}
            <div className="relative mb-10 group">
              {renderRemoveButton(activeIndex)}
              <div
                className="absolute -inset-2 rounded-full opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  filter: 'blur(12px)',
                }}
              />
              <AvatarCircle
                author={current.author}
                colors={colors}
                sizeClass="relative w-28 h-28 border-4 border-[#0a0a0f]"
                textSize="text-4xl"
              />
            </div>

            {/* Stars centered */}
            <div className="flex justify-center mb-8">
              <StarRating
                rating={current.rating || 5}
                accentColor={colors.accent}
                isEditing={isEditing}
                onChange={(val) => updateItem(activeIndex, 'rating', val)}
                size="w-6 h-6"
              />
            </div>

            {/* Large quote text */}
            <EditableText
              value={current.quote || 'ביקורת כאן'}
              onChange={(value) => updateItem(activeIndex, 'quote', value)}
              isEditing={isEditing}
              className="text-2xl md:text-4xl text-white leading-relaxed font-light mb-10 max-w-2xl"
              as="p"
              style={{ fontFamily: fonts.heading }}
            />

            {/* Author name big */}
            <EditableText
              value={current.author || 'שם'}
              onChange={(value) => updateItem(activeIndex, 'author', value)}
              isEditing={isEditing}
              className="text-xl md:text-2xl font-bold text-white mb-2"
              as="p"
              style={{ fontFamily: fonts.heading }}
            />

            {/* Role & company */}
            <div className="flex items-center justify-center gap-2 text-white/40 text-base mb-12">
              <EditableText
                value={current.role || 'תפקיד'}
                onChange={(value) => updateItem(activeIndex, 'role', value)}
                isEditing={isEditing}
                as="span"
              />
              {current.company && (
                <>
                  <span>&#x2022;</span>
                  <EditableText
                    value={current.company}
                    onChange={(value) =>
                      updateItem(activeIndex, 'company', value)
                    }
                    isEditing={isEditing}
                    as="span"
                  />
                </>
              )}
            </div>

            {/* Click to navigate hint + counter */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="group/btn flex flex-col items-center gap-3"
            >
              {/* Dot indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <span
                    key={i}
                    className={`block rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-6 h-2' : 'w-2 h-2 bg-white/20'
                    }`}
                    style={
                      i === activeIndex
                        ? { backgroundColor: colors.primary }
                        : {}
                    }
                  />
                ))}
              </div>
              <span className="text-white/30 text-sm group-hover/btn:text-white/50 transition-colors">
                {testimonials.length > 1 ? 'לחץ לביקורת הבאה' : ''}
              </span>
            </button>

            {renderAddButton()}
          </div>
        </div>
      </>
    );
  }
}
