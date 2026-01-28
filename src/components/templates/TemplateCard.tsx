import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Check, Eye, FileText, Palette, Rocket, UtensilsCrossed } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Template = Tables<'templates'>;

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
}

const categoryConfig: Record<string, { 
  icon: React.ElementType; 
  gradient: string; 
  label: string;
  badgeClass: string;
}> = {
  restaurant: {
    icon: UtensilsCrossed,
    gradient: 'from-orange-500/20 via-amber-500/10 to-red-500/20',
    label: 'מסעדות',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  },
  portfolio: {
    icon: Palette,
    gradient: 'from-slate-500/20 via-blue-500/10 to-indigo-500/20',
    label: 'פורטפוליו',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
  },
  business: {
    icon: Building2,
    gradient: 'from-blue-600/20 via-cyan-500/10 to-emerald-500/20',
    label: 'עסקי',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  landing: {
    icon: Rocket,
    gradient: 'from-purple-600/20 via-pink-500/10 to-amber-500/20',
    label: 'דף נחיתה',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  }
};

export function TemplateCard({ template, onSelect, onPreview }: TemplateCardProps) {
  const config = categoryConfig[template.category] || {
    icon: FileText,
    gradient: 'from-primary/20 via-secondary/10 to-accent/20',
    label: template.category,
    badgeClass: 'bg-secondary text-secondary-foreground'
  };
  
  const IconComponent = config.icon;
  const blueprintSchema = template.blueprint_schema as any;
  const pageCount = blueprintSchema?.pages?.length || 0;
  const sectionCount = blueprintSchema?.pages?.reduce(
    (acc: number, page: any) => acc + (page.sections?.length || 0), 
    0
  ) || 0;

  return (
    <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      {/* Thumbnail Area */}
      <div 
        className={`relative h-48 bg-gradient-to-br ${config.gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Icon */}
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
          <div className="w-20 h-20 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <IconComponent className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Category Badge */}
        <Badge className={`absolute top-3 right-3 ${config.badgeClass} border-0`}>
          {config.label}
        </Badge>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            תצוגה מקדימה
          </Button>
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            בחר
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3" onClick={() => onSelect(template)}>
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {template.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {pageCount} עמודים
          </span>
          <span>•</span>
          <span>{sectionCount} סקשנים</span>
        </div>
      </CardContent>
    </Card>
  );
}
