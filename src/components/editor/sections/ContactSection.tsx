import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ContactContent {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
  show_form?: boolean;
  show_map?: boolean;
}

export function ContactSection({
  content,
  variant = 'default',
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const contactContent = content as ContactContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();

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

  const updateContent = (key: keyof ContactContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'אימייל',
      value: contactContent.email || 'hello@example.com',
      key: 'email' as const,
    },
    {
      icon: Phone,
      label: 'טלפון',
      value: contactContent.phone || '054-1234567',
      key: 'phone' as const,
    },
    {
      icon: MapPin,
      label: 'כתובת',
      value: contactContent.address || 'תל אביב, ישראל',
      key: 'address' as const,
    },
    {
      icon: Clock,
      label: 'שעות פעילות',
      value: contactContent.hours || 'א-ה: 09:00-18:00',
      key: 'hours' as const,
    },
  ];

  const getGradientForIndex = (index: number) => {
    const gradients = [
      `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
      `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    ];
    return gradients[index % gradients.length];
  };

  // Shared form builder
  const renderForm = (opts?: { inputBg?: string; labelColor?: string; buttonStyle?: React.CSSProperties; buttonClassName?: string }) => {
    const {
      inputBg = 'bg-muted/50',
      labelColor = '',
      buttonStyle = {
        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
        borderRadius: getButtonRadius(),
      },
      buttonClassName = 'w-full h-14 text-lg group text-white',
    } = opts || {};

    return (
      <form className="space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>שם מלא</label>
            <Input
              placeholder="ישראל ישראלי"
              className={`h-12 ${inputBg} border-border/50 focus:border-primary transition-colors`}
              style={{ borderRadius: getButtonRadius() }}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>טלפון</label>
            <Input
              placeholder="054-1234567"
              className={`h-12 ${inputBg} border-border/50 focus:border-primary transition-colors`}
              style={{ borderRadius: getButtonRadius() }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${labelColor}`}>אימייל</label>
          <Input
            type="email"
            placeholder="example@email.com"
            className={`h-12 ${inputBg} border-border/50 focus:border-primary transition-colors`}
            style={{ borderRadius: getButtonRadius() }}
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${labelColor}`}>הודעה</label>
          <Textarea
            placeholder="ספרו לנו איך נוכל לעזור..."
            rows={5}
            className={`${inputBg} border-border/50 focus:border-primary transition-colors resize-none`}
            style={{ borderRadius: getButtonRadius() }}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className={buttonClassName}
          style={buttonStyle}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            שליחה
            <Send className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </span>
        </Button>
      </form>
    );
  };

  // ─── VARIANT: SPLIT ─────────────────────────────────────
  if (variant === 'split') {
    return (
      <section
        ref={sectionRef}
        className={`relative overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left - Dark/Colored panel with contact info */}
          <div
            className="relative p-12 lg:p-16 flex flex-col justify-center"
            style={{
              background: `linear-gradient(160deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-10"
              style={{ backgroundColor: colors.accent }}
            />
            <div
              className="absolute bottom-10 right-10 w-64 h-64 rounded-full opacity-5"
              style={{ backgroundColor: '#ffffff' }}
            />

            <div className={`relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText
                value={contactContent.title || 'צרו איתנו קשר'}
                onChange={(value) => updateContent('title', value)}
                isEditing={isEditing}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                as="h2"
                style={{ fontFamily: fonts.heading }}
              />
              <EditableText
                value={contactContent.subtitle || 'נשמח לשמוע מכם ולעזור בכל שאלה'}
                onChange={(value) => updateContent('subtitle', value)}
                isEditing={isEditing}
                className="text-lg text-white/70 mb-12 block"
                as="p"
              />

              <div className="space-y-8">
                {contactMethods.map((method, index) => (
                  <div
                    key={method.key}
                    className={`flex items-center gap-5 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    >
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50 mb-0.5">{method.label}</p>
                      <EditableText
                        value={method.value}
                        onChange={(value) => updateContent(method.key, value)}
                        isEditing={isEditing}
                        className="text-white font-medium"
                        as="p"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Light panel with form */}
          <div className="bg-background p-12 lg:p-16 flex flex-col justify-center">
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: fonts.heading }}
              >
                שלחו לנו הודעה
              </h3>
              <p className="text-muted-foreground mb-8">
                מלאו את הטופס ונחזור אליכם בהקדם
              </p>

              {contactContent.show_form !== false && renderForm({
                inputBg: 'bg-muted/30',
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── VARIANT: MINIMAL ───────────────────────────────────
  if (variant === 'minimal') {
    return (
      <section
        ref={sectionRef}
        className={`relative py-24 px-4 transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`border border-border/60 bg-card p-8 md:p-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ borderRadius: getCardRadius() }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <EditableText
                value={contactContent.title || 'צרו איתנו קשר'}
                onChange={(value) => updateContent('title', value)}
                isEditing={isEditing}
                className="text-3xl font-bold mb-3"
                as="h2"
                style={{ fontFamily: fonts.heading }}
              />
              <EditableText
                value={contactContent.subtitle || 'נשמח לשמוע מכם ולעזור בכל שאלה'}
                onChange={(value) => updateContent('subtitle', value)}
                isEditing={isEditing}
                className="text-muted-foreground"
                as="p"
              />
            </div>

            {/* Contact Info - simple horizontal list */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {contactMethods.map((method) => (
                <div
                  key={method.key}
                  className="flex items-center gap-3 p-3 rounded-lg"
                >
                  <method.icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: colors.primary }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{method.label}</p>
                    <EditableText
                      value={method.value}
                      onChange={(value) => updateContent(method.key, value)}
                      isEditing={isEditing}
                      className="text-sm font-medium truncate"
                      as="p"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border/60 mb-10" />

            {/* Form */}
            {contactContent.show_form !== false && renderForm({
              inputBg: 'bg-muted/30',
              buttonStyle: {
                backgroundColor: colors.primary,
                borderRadius: getButtonRadius(),
              },
              buttonClassName: 'w-full h-12 text-base group text-white',
            })}
          </div>
        </div>
      </section>
    );
  }

  // ─── VARIANT: FULL ──────────────────────────────────────
  if (variant === 'full') {
    return (
      <section
        ref={sectionRef}
        className={`relative py-32 px-4 overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />

        <div className="relative max-w-7xl mx-auto">
          {/* Large headline */}
          <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EditableText
              value={contactContent.title || 'בואו נדבר'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
              as="h2"
              style={{ fontFamily: fonts.heading }}
            />
            <EditableText
              value={contactContent.subtitle || 'אנחנו כאן בשבילכם. צרו קשר בכל דרך שנוחה לכם.'}
              onChange={(value) => updateContent('subtitle', value)}
              isEditing={isEditing}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl"
              as="p"
            />
          </div>

          {/* 4 contact method cards in a row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={method.key}
                className={`group relative p-8 border border-border/40 bg-card hover:border-transparent hover:shadow-2xl transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                  borderRadius: getCardRadius(),
                }}
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: getGradientForIndex(index),
                    borderRadius: getCardRadius(),
                  }}
                />
                <div
                  className="absolute inset-[1px] bg-card transition-colors duration-500"
                  style={{ borderRadius: `calc(${getCardRadius()} - 1px)` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                    }}
                  >
                    <method.icon
                      className="w-6 h-6 transition-colors"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {method.label}
                  </p>
                  <EditableText
                    value={method.value}
                    onChange={(value) => updateContent(method.key, value)}
                    isEditing={isEditing}
                    className="font-semibold text-lg"
                    as="p"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Full-width form */}
          {contactContent.show_form !== false && (
            <div
              className={`p-10 md:p-14 border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '600ms',
                borderRadius: getCardRadius(),
              }}
            >
              <h3
                className="text-2xl font-bold mb-8"
                style={{ fontFamily: fonts.heading }}
              >
                שלחו לנו הודעה
              </h3>
              {renderForm({
                inputBg: 'bg-muted/40',
                buttonClassName: 'w-full md:w-auto md:px-16 h-14 text-lg group text-white',
                buttonStyle: {
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                  borderRadius: getButtonRadius(),
                },
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── VARIANT: DEFAULT (form) ────────────────────────────
  return (
    <section
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      {/* Decorative orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}10` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}10` }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
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
              borderRadius: getButtonRadius(),
            }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>בואו נדבר</span>
          </div>
          <EditableText
            value={contactContent.title || 'צרו איתנו קשר'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold mb-4"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />
          <EditableText
            value={contactContent.subtitle || 'נשמח לשמוע מכם ולעזור בכל שאלה'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            as="p"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Methods - glass cards with gradient icons */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {contactMethods.map((method, index) => (
              <div
                key={method.key}
                className={`group overflow-hidden border border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card p-6 flex items-center gap-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                  borderRadius: getCardRadius(),
                }}
              >
                {/* Gradient icon */}
                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                  style={{ background: getGradientForIndex(index) }}
                >
                  <method.icon className="w-6 h-6 text-white" />
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                    style={{ background: getGradientForIndex(index) }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    {method.label}
                  </p>
                  <EditableText
                    value={method.value}
                    onChange={(value) => updateContent(method.key, value)}
                    isEditing={isEditing}
                    className="font-semibold transition-colors"
                    as="p"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          {contactContent.show_form !== false && (
            <div
              className={`lg:col-span-3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div
                className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-2xl"
                style={{ borderRadius: getCardRadius() }}
              >
                {/* Gradient top border */}
                <div
                  className="h-1"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.accent}, ${colors.primary})`,
                  }}
                />

                <div className="p-8 md:p-10">
                  <h3
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: fonts.heading }}
                  >
                    שלחו לנו הודעה
                  </h3>

                  {renderForm()}

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    המידע שלכם מאובטח ולא ישותף עם צד שלישי
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
