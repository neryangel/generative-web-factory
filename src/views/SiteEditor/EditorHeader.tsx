import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SiteSettingsDialog } from '@/components/site/SiteSettingsDialog';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Settings2,
  Upload,
  ExternalLink,
} from 'lucide-react';
import type { EditorHeaderProps } from './editor.types';
import type { ViewMode } from '@/types';

export function EditorHeader({
  site,
  pages,
  currentPage,
  viewMode,
  isEditing,
  isSaving,
  lastSaved,
  onPageChange,
  onViewModeChange,
  onToggleEditing,
  onPublish,
  onSiteUpdate,
}: EditorHeaderProps) {
  const handleViewPublished = () => {
    if (site?.slug) {
      window.open(`/s/${site.slug}`, '_blank');
    }
  };

  return (
    <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/sites">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{site.name}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              site.status === 'published' ? 'status-published' : 'status-draft'
            }`}
          >
            {site.status === 'published' ? 'פורסם' : 'טיוטה'}
          </span>
          <SiteSettingsDialog site={site} onUpdate={onSiteUpdate}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </SiteSettingsDialog>
        </div>
      </div>

      {/* Page Selector */}
      <div className="flex items-center gap-2">
        <Select
          value={currentPage?.id || ''}
          onValueChange={(value) => {
            const page = pages.find((p) => p.id === value);
            if (page) onPageChange(page);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="בחר עמוד" />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-2">
        {/* Device Switcher */}
        <DeviceSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />

        {/* Edit/Preview Toggle */}
        <Button variant="outline" size="sm" onClick={onToggleEditing} className="gap-2">
          {isEditing ? (
            <>
              <Eye className="h-4 w-4" />
              תצוגה מקדימה
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              חזרה לעריכה
            </>
          )}
        </Button>

        {/* Save Status */}
        <SaveStatus isSaving={isSaving} lastSaved={lastSaved} />

        {/* View Published Site */}
        {site.status === 'published' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleViewPublished} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                צפה באתר
              </Button>
            </TooltipTrigger>
            <TooltipContent>פתח את האתר המפורסם בטאב חדש</TooltipContent>
          </Tooltip>
        )}

        {/* Publish Button */}
        <Button onClick={onPublish} className="gap-2">
          <Upload className="h-4 w-4" />
          פרסם
        </Button>
      </div>
    </header>
  );
}

interface DeviceSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function DeviceSwitcher({ viewMode, onViewModeChange }: DeviceSwitcherProps) {
  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>מחשב</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange('tablet')}
          >
            <Tablet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>טאבלט</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>נייד</TooltipContent>
      </Tooltip>
    </div>
  );
}

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

function SaveStatus({ isSaving, lastSaved }: SaveStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
      {isSaving ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>שומר...</span>
        </>
      ) : lastSaved ? (
        <>
          <Check className="h-3 w-3 text-success" />
          <span>נשמר</span>
        </>
      ) : null}
    </div>
  );
}
