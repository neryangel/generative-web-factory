import { useRef } from 'react';
import type { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, Plus, Sparkles, Trash2, Twitter } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface TeamContent {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    name: '\u05D3\u05E0\u05D9\u05D0\u05DC \u05DB\u05D4\u05DF',
    role: '\u05DE\u05E0\u05DB"\u05DC \u05D5\u05DE\u05D9\u05D9\u05E1\u05D3',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: '\u05DE\u05D5\u05D1\u05D9\u05DC \u05D7\u05D6\u05D5\u05DF \u05D5\u05D7\u05D3\u05E9\u05E0\u05D5\u05EA \u05D1\u05D7\u05D1\u05E8\u05D4',
    linkedin: '#',
    twitter: '#',
    email: 'daniel@example.com'
  },
  {
    name: '\u05DE\u05D9\u05DB\u05DC \u05DC\u05D5\u05D9',
    role: '\u05E1\u05DE\u05E0\u05DB"\u05DC\u05D9\u05EA \u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D5\u05EA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: '\u05DE\u05D5\u05DE\u05D7\u05D9\u05EA \u05D1\u05E4\u05D9\u05EA\u05D5\u05D7 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD',
    linkedin: '#',
    twitter: '#',
    email: 'michal@example.com'
  },
  {
    name: '\u05D9\u05D5\u05E1\u05D9 \u05D0\u05D1\u05E8\u05D4\u05DD',
    role: '\u05DE\u05E0\u05D4\u05DC \u05E2\u05D9\u05E6\u05D5\u05D1',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: '\u05D9\u05D5\u05E6\u05E8 \u05D7\u05D5\u05D5\u05D9\u05D5\u05EA \u05DE\u05E9\u05EA\u05DE\u05E9 \u05DE\u05D3\u05D4\u05D9\u05DE\u05D5\u05EA',
    linkedin: '#',
    twitter: '#',
    email: 'yossi@example.com'
  },
  {
    name: '\u05E9\u05D9\u05E8\u05D4 \u05D2\u05D5\u05DC\u05DF',
    role: '\u05DE\u05E0\u05D4\u05DC\u05EA \u05E9\u05D9\u05D5\u05D5\u05E7',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: '\u05D1\u05D5\u05E0\u05D4 \u05DE\u05D5\u05EA\u05D2\u05D9\u05DD \u05DE\u05E0\u05E6\u05D7\u05D9\u05DD',
    linkedin: '#',
    twitter: '#',
    email: 'shira@example.com'
  }
];

// ─── Shared helpers ───────────────────────────────────────────────

function useSectionData(content: Record<string, unknown>) {
  const teamContent = content as TeamContent;
  const members = teamContent.members || defaultMembers;
  return { teamContent, members };
}

function SocialLinks({
  member,
  className = '',
  iconSize = 'w-5 h-5',
  linkClassName = '',
}: {
  member: TeamMember;
  className?: string;
  iconSize?: string;
  linkClassName?: string;
}) {
  return (
    <div className={className}>
      {member.linkedin && (
        <a
          href={member.linkedin}
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          <Linkedin className={iconSize} />
        </a>
      )}
      {member.twitter && (
        <a
          href={member.twitter}
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          <Twitter className={iconSize} />
        </a>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className={iconSize} />
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT: default (grid)
// 4-column grid, dark bg, glass cards, hover overlay with socials
// ═══════════════════════════════════════════════════════════════════

function DefaultVariant({
  content,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const { colors, fonts, getCardRadius } = useTheme();
  const { teamContent, members } = useSectionData(content);

  const updateContent = (key: keyof TeamContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateMember = (index: number, key: keyof TeamMember, value: unknown) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    updateContent('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [
      ...members,
      {
        name: '\u05E9\u05DD \u05D7\u05D3\u05E9',
        role: '\u05EA\u05E4\u05E7\u05D9\u05D3',
        image:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
        bio: '\u05EA\u05D9\u05D0\u05D5\u05E8 \u05E7\u05E6\u05E8',
        linkedin: '#',
        twitter: '#',
        email: 'email@example.com',
      },
    ];
    updateContent('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    updateContent('members', newMembers);
  };

  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-900" />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--gradient-mesh)', opacity: 0.3 }}
      />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="floating-orb w-[350px] h-[350px] top-20 -right-20 bg-pink-500/20" />
      <div className="floating-orb w-[250px] h-[250px] bottom-40 -left-10 bg-blue-500/15" />
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-white/80">\u05D4\u05E6\u05D5\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5</span>
          </div>

          <EditableText
            value={teamContent.title || '\u05D4\u05DB\u05D9\u05E8\u05D5 \u05D0\u05EA \u05D4\u05E6\u05D5\u05D5\u05EA \u05D4\u05DE\u05D3\u05D4\u05D9\u05DD \u05E9\u05DC\u05E0\u05D5'}
            onChange={(v) => updateContent('title', v)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: fonts.heading }}
            as="h2"
          />

          <EditableText
            value={
              teamContent.subtitle ||
              '\u05D0\u05E0\u05E9\u05D9\u05DD \u05DE\u05D5\u05DB\u05E9\u05E8\u05D9\u05DD \u05E9\u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05E7\u05E9\u05D4 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05E4\u05D5\u05DA \u05D0\u05EA \u05D4\u05D7\u05D6\u05D5\u05DF \u05E9\u05DC\u05DB\u05DD \u05DC\u05DE\u05E6\u05D9\u05D0\u05D5\u05EA'
            }
            onChange={(v) => updateContent('subtitle', v)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body }}
            as="p"
          />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div key={index} className="group relative">
              <div
                className="relative overflow-hidden glass-dark border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2"
                style={{ borderRadius: getCardRadius() }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Social links on hover */}
                  <SocialLinks
                    member={member}
                    className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                    linkClassName="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                  />

                  {/* Edit controls */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <ImagePickerDialog
                        onSelect={(url) => updateMember(index, 'image', url)}
                        currentImage={member.image}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          className="glass-dark text-white text-xs"
                        >
                          \u05D4\u05D7\u05DC\u05E3 \u05EA\u05DE\u05D5\u05E0\u05D4
                        </Button>
                      </ImagePickerDialog>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMember(index);
                        }}
                        className="p-2 rounded-lg glass-dark text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 text-center">
                  <EditableText
                    value={member.name}
                    onChange={(v) => updateMember(index, 'name', v)}
                    isEditing={isEditing}
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: fonts.heading }}
                    as="h3"
                  />
                  <EditableText
                    value={member.role}
                    onChange={(v) => updateMember(index, 'role', v)}
                    isEditing={isEditing}
                    className="font-medium mb-2"
                    style={{
                      fontFamily: fonts.body,
                      color: colors.primary,
                    }}
                    as="p"
                  />
                  <EditableText
                    value={member.bio}
                    onChange={(v) => updateMember(index, 'bio', v)}
                    isEditing={isEditing}
                    className="text-white/60 text-sm"
                    style={{ fontFamily: fonts.body }}
                    as="p"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add member */}
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addMember();
              }}
              className="border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center min-h-[300px] text-white/40 hover:text-white/60 transition-all"
              style={{ borderRadius: getCardRadius() }}
            >
              <Plus className="w-12 h-12 mb-2" />
              <span>\u05D4\u05D5\u05E1\u05E3 \u05D7\u05D1\u05E8 \u05E6\u05D5\u05D5\u05EA</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT: carousel
// Horizontal scrollable carousel with larger cards
// ═══════════════════════════════════════════════════════════════════

function CarouselVariant({
  content,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const { colors, fonts, getCardRadius, getButtonRadius } = useTheme();
  const { teamContent, members } = useSectionData(content);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateContent = (key: keyof TeamContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateMember = (index: number, key: keyof TeamMember, value: unknown) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    updateContent('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [
      ...members,
      {
        name: '\u05E9\u05DD \u05D7\u05D3\u05E9',
        role: '\u05EA\u05E4\u05E7\u05D9\u05D3',
        image:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
        bio: '\u05EA\u05D9\u05D0\u05D5\u05E8 \u05E7\u05E6\u05E8',
        linkedin: '#',
        twitter: '#',
        email: 'email@example.com',
      },
    ];
    updateContent('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    updateContent('members', newMembers);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{
        background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondary}ee 50%, ${colors.secondary}dd 100%)`,
      }}
    >
      {/* Decorative accent strip at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent}, transparent)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase"
              style={{
                color: colors.primary,
                borderLeft: `3px solid ${colors.primary}`,
                paddingLeft: '12px',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              \u05D4\u05E6\u05D5\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5
            </div>

            <EditableText
              value={teamContent.title || '\u05D4\u05DB\u05D9\u05E8\u05D5 \u05D0\u05EA \u05D4\u05E6\u05D5\u05D5\u05EA \u05D4\u05DE\u05D3\u05D4\u05D9\u05DD \u05E9\u05DC\u05E0\u05D5'}
              onChange={(v) => updateContent('title', v)}
              isEditing={isEditing}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: fonts.heading }}
              as="h2"
            />

            <EditableText
              value={
                teamContent.subtitle ||
                '\u05D0\u05E0\u05E9\u05D9\u05DD \u05DE\u05D5\u05DB\u05E9\u05E8\u05D9\u05DD \u05E9\u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05E7\u05E9\u05D4 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05E4\u05D5\u05DA \u05D0\u05EA \u05D4\u05D7\u05D6\u05D5\u05DF \u05E9\u05DC\u05DB\u05DD \u05DC\u05DE\u05E6\u05D9\u05D0\u05D5\u05EA'
              }
              onChange={(v) => updateContent('subtitle', v)}
              isEditing={isEditing}
              className="text-lg text-white/50 max-w-xl"
              style={{ fontFamily: fonts.body }}
              as="p"
            />
          </div>

          {/* Scroll buttons */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                scroll('right');
              }}
              className="border-white/20 text-white hover:bg-white/10"
              style={{ borderRadius: getButtonRadius() }}
            >
              \u2190
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                scroll('left');
              }}
              className="border-white/20 text-white hover:bg-white/10"
              style={{ borderRadius: getButtonRadius() }}
            >
              \u2192
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {members.map((member, index) => (
            <div
              key={index}
              className="snap-start shrink-0 w-[340px] group"
            >
              <div
                className="relative overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-500 h-full"
                style={{
                  borderRadius: getCardRadius(),
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Large image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${colors.secondary} 0%, transparent 60%)`,
                    }}
                  />

                  {/* Edit controls */}
                  {isEditing && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <ImagePickerDialog
                        onSelect={(url) => updateMember(index, 'image', url)}
                        currentImage={member.image}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs bg-black/50 text-white backdrop-blur-sm"
                        >
                          \u05D4\u05D7\u05DC\u05E3 \u05EA\u05DE\u05D5\u05E0\u05D4
                        </Button>
                      </ImagePickerDialog>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMember(index);
                        }}
                        className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 -mt-8 relative z-10">
                  <EditableText
                    value={member.name}
                    onChange={(v) => updateMember(index, 'name', v)}
                    isEditing={isEditing}
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: fonts.heading }}
                    as="h3"
                  />
                  <EditableText
                    value={member.role}
                    onChange={(v) => updateMember(index, 'role', v)}
                    isEditing={isEditing}
                    className="text-sm font-semibold uppercase tracking-wider mb-3"
                    style={{ fontFamily: fonts.body, color: colors.accent }}
                    as="p"
                  />
                  <EditableText
                    value={member.bio}
                    onChange={(v) => updateMember(index, 'bio', v)}
                    isEditing={isEditing}
                    className="text-white/50 text-sm leading-relaxed mb-4"
                    style={{ fontFamily: fonts.body }}
                    as="p"
                  />

                  {/* Social links always visible in carousel */}
                  <SocialLinks
                    member={member}
                    className="flex gap-3 pt-3 border-t border-white/10"
                    iconSize="w-4 h-4"
                    linkClassName="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add member card */}
          {isEditing && (
            <div className="snap-start shrink-0 w-[340px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addMember();
                }}
                className="w-full h-full min-h-[420px] border-2 border-dashed border-white/15 hover:border-white/30 flex flex-col items-center justify-center text-white/30 hover:text-white/50 transition-all"
                style={{ borderRadius: getCardRadius() }}
              >
                <Plus className="w-14 h-14 mb-3" />
                <span className="text-lg">\u05D4\u05D5\u05E1\u05E3 \u05D7\u05D1\u05E8 \u05E6\u05D5\u05D5\u05EA</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT: minimal
// Clean list layout, circular avatars, horizontal rows
// ═══════════════════════════════════════════════════════════════════

function MinimalVariant({
  content,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const { colors, fonts, darkMode, getCardRadius } = useTheme();
  const { teamContent, members } = useSectionData(content);

  const textColor = darkMode ? '#ffffff' : '#111827';
  const mutedColor = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const bgColor = darkMode ? '#0f172a' : '#ffffff';
  const cardBg = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const updateContent = (key: keyof TeamContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateMember = (index: number, key: keyof TeamMember, value: unknown) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    updateContent('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [
      ...members,
      {
        name: '\u05E9\u05DD \u05D7\u05D3\u05E9',
        role: '\u05EA\u05E4\u05E7\u05D9\u05D3',
        image:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
        bio: '\u05EA\u05D9\u05D0\u05D5\u05E8 \u05E7\u05E6\u05E8',
        linkedin: '#',
        twitter: '#',
        email: 'email@example.com',
      },
    ];
    updateContent('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    updateContent('members', newMembers);
  };

  return (
    <section
      className={`relative py-20 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <div
            className="inline-flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: colors.primary }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            \u05D4\u05E6\u05D5\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5
          </div>

          <EditableText
            value={teamContent.title || '\u05D4\u05DB\u05D9\u05E8\u05D5 \u05D0\u05EA \u05D4\u05E6\u05D5\u05D5\u05EA \u05D4\u05DE\u05D3\u05D4\u05D9\u05DD \u05E9\u05DC\u05E0\u05D5'}
            onChange={(v) => updateContent('title', v)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: fonts.heading, color: textColor }}
            as="h2"
          />

          <EditableText
            value={
              teamContent.subtitle ||
              '\u05D0\u05E0\u05E9\u05D9\u05DD \u05DE\u05D5\u05DB\u05E9\u05E8\u05D9\u05DD \u05E9\u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05E7\u05E9\u05D4 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05E4\u05D5\u05DA \u05D0\u05EA \u05D4\u05D7\u05D6\u05D5\u05DF \u05E9\u05DC\u05DB\u05DD \u05DC\u05DE\u05E6\u05D9\u05D0\u05D5\u05EA'
            }
            onChange={(v) => updateContent('subtitle', v)}
            isEditing={isEditing}
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: fonts.body, color: mutedColor }}
            as="p"
          />
        </div>

        {/* Member list */}
        <div className="flex flex-col gap-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-6 p-5 transition-all duration-300 hover:shadow-sm"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: getCardRadius(),
              }}
            >
              {/* Circular avatar */}
              <div className="relative shrink-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover"
                  style={{
                    border: `2px solid ${colors.primary}33`,
                  }}
                />
                {isEditing && (
                  <ImagePickerDialog
                    onSelect={(url) => updateMember(index, 'image', url)}
                    currentImage={member.image}
                  >
                    <button className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
                      \u05D4\u05D7\u05DC\u05E3
                    </button>
                  </ImagePickerDialog>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <EditableText
                    value={member.name}
                    onChange={(v) => updateMember(index, 'name', v)}
                    isEditing={isEditing}
                    className="text-lg font-semibold"
                    style={{ fontFamily: fonts.heading, color: textColor }}
                    as="h3"
                  />
                  <EditableText
                    value={member.role}
                    onChange={(v) => updateMember(index, 'role', v)}
                    isEditing={isEditing}
                    className="text-sm font-medium"
                    style={{ fontFamily: fonts.body, color: colors.primary }}
                    as="span"
                  />
                </div>
                <EditableText
                  value={member.bio}
                  onChange={(v) => updateMember(index, 'bio', v)}
                  isEditing={isEditing}
                  className="text-sm mb-2"
                  style={{ fontFamily: fonts.body, color: mutedColor }}
                  as="p"
                />

                {/* Social links inline */}
                <SocialLinks
                  member={member}
                  className="flex gap-2"
                  iconSize="w-3.5 h-3.5"
                  linkClassName="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  />
              </div>

              {/* Remove button */}
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(index);
                  }}
                  className="shrink-0 p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(248,113,113)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Add member */}
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addMember();
              }}
              className="flex items-center justify-center gap-3 p-5 border-2 border-dashed transition-all"
              style={{
                borderColor: borderColor,
                color: mutedColor,
                borderRadius: getCardRadius(),
              }}
            >
              <Plus className="w-6 h-6" />
              <span className="text-base">\u05D4\u05D5\u05E1\u05E3 \u05D7\u05D1\u05E8 \u05E6\u05D5\u05D5\u05EA</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main export — dispatches to the correct variant
// ═══════════════════════════════════════════════════════════════════

export function TeamSection(props: SectionProps) {
  switch (props.variant) {
    case 'carousel':
      return <CarouselVariant {...props} />;
    case 'minimal':
      return <MinimalVariant {...props} />;
    default:
      return <DefaultVariant {...props} />;
  }
}
