import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Palette, Building2, Rocket, UtensilsCrossed, LayoutGrid, Stethoscope, Home, PartyPopper, Code } from 'lucide-react';

export type TemplateCategory = 'all' | 'restaurant' | 'portfolio' | 'business' | 'landing' | 'clinic' | 'realestate' | 'event' | 'saas';

interface TemplateCategoryFilterProps {
  selectedCategory: TemplateCategory;
  onCategoryChange: (category: TemplateCategory) => void;
  categoryCounts?: Record<string, number>;
}

const categories: { id: TemplateCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'הכל', icon: LayoutGrid },
  { id: 'restaurant', label: 'מסעדות', icon: UtensilsCrossed },
  { id: 'portfolio', label: 'פורטפוליו', icon: Palette },
  { id: 'business', label: 'עסקי', icon: Building2 },
  { id: 'landing', label: 'דף נחיתה', icon: Rocket },
  { id: 'saas', label: 'SaaS', icon: Code },
  { id: 'clinic', label: 'קליניקה', icon: Stethoscope },
  { id: 'realestate', label: 'נדל"ן', icon: Home },
  { id: 'event', label: 'אירועים', icon: PartyPopper },
];

export function TemplateCategoryFilter({
  selectedCategory,
  onCategoryChange,
  categoryCounts
}: TemplateCategoryFilterProps) {
  // Only show categories that have templates (or 'all')
  const visibleCategories = categories.filter(
    cat => cat.id === 'all' || (categoryCounts?.[cat.id] ?? 0) > 0
  );

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {visibleCategories.map((category) => {
        const IconComponent = category.icon;
        const count = category.id === 'all'
          ? Object.values(categoryCounts || {}).reduce((a, b) => a + b, 0)
          : categoryCounts?.[category.id] || 0;

        const isSelected = selectedCategory === category.id;

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "gap-2 transition-all",
              isSelected && "shadow-md"
            )}
          >
            <IconComponent className="h-4 w-4" />
            {category.label}
            {count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
