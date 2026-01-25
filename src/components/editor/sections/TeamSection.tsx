import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Linkedin, Twitter, Mail, Plus, Trash2 } from 'lucide-react';

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
    name: 'דניאל כהן',
    role: 'מנכ"ל ומייסד',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'מוביל חזון וחדשנות בחברה',
    linkedin: '#',
    twitter: '#',
    email: 'daniel@example.com'
  },
  {
    name: 'מיכל לוי',
    role: 'סמנכ"לית טכנולוגיות',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'מומחית בפיתוח מוצרים',
    linkedin: '#',
    twitter: '#',
    email: 'michal@example.com'
  },
  {
    name: 'יוסי אברהם',
    role: 'מנהל עיצוב',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'יוצר חוויות משתמש מדהימות',
    linkedin: '#',
    twitter: '#',
    email: 'yossi@example.com'
  },
  {
    name: 'שירה גולן',
    role: 'מנהלת שיווק',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'בונה מותגים מנצחים',
    linkedin: '#',
    twitter: '#',
    email: 'shira@example.com'
  }
];

export function TeamSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const teamContent = content as TeamContent;
  const members = teamContent.members || defaultMembers;

  const updateContent = (key: keyof TeamContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateMember = (index: number, key: keyof TeamMember, value: unknown) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    updateContent('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [...members, {
      name: 'שם חדש',
      role: 'תפקיד',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
      bio: 'תיאור קצר',
      linkedin: '#',
      twitter: '#',
      email: 'email@example.com'
    }];
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
      
      {/* Mesh Gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.3 }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Orbs */}
      <div className="floating-orb w-[350px] h-[350px] top-20 -right-20 bg-pink-500/20" />
      <div className="floating-orb w-[250px] h-[250px] bottom-40 -left-10 bg-blue-500/15" />
      
      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-white/80">הצוות שלנו</span>
          </div>
          
          <EditableText
            value={teamContent.title || 'הכירו את הצוות המדהים שלנו'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            as="h2"
          />
          
          <EditableText
            value={teamContent.subtitle || 'אנשים מוכשרים שעובדים קשה כדי להפוך את החזון שלכם למציאות'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="relative rounded-3xl overflow-hidden glass-dark border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Social Links on Hover */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.twitter && (
                      <a 
                        href={member.twitter}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Edit Overlay */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <ImagePickerDialog
                        onSelect={(url) => updateMember(index, 'image', url)}
                        currentImage={member.image}
                      >
                        <Button size="sm" variant="secondary" className="glass-dark text-white text-xs">
                          החלף תמונה
                        </Button>
                      </ImagePickerDialog>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeMember(index); }}
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
                    onChange={(value) => updateMember(index, 'name', value)}
                    isEditing={isEditing}
                    className="text-xl font-bold text-white mb-1"
                    as="h3"
                  />
                  <EditableText
                    value={member.role}
                    onChange={(value) => updateMember(index, 'role', value)}
                    isEditing={isEditing}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-medium mb-2"
                    as="p"
                  />
                  <EditableText
                    value={member.bio}
                    onChange={(value) => updateMember(index, 'bio', value)}
                    isEditing={isEditing}
                    className="text-white/60 text-sm"
                    as="p"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Member Button */}
          {isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); addMember(); }}
              className="rounded-3xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center min-h-[300px] text-white/40 hover:text-white/60 transition-all"
            >
              <Plus className="w-12 h-12 mb-2" />
              <span>הוסף חבר צוות</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
