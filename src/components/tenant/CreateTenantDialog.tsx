import { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

interface CreateTenantDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateTenantDialog({ children, onSuccess }: CreateTenantDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTenant } = useTenant();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await createTenant(name.trim(), slug.trim());
      
      if (error) {
        console.error('Tenant creation error:', error);
        if (error.message?.includes('duplicate')) {
          toast.error('שם הארגון כבר קיים, נסה שם אחר');
        } else if (error.message?.includes('row-level security')) {
          toast.error('שגיאת הרשאות - נסה להתחבר מחדש');
        } else {
          toast.error(`שגיאה ביצירת הארגון: ${error.message}`);
        }
        return;
      }

      // Small delay to ensure the trigger has completed
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('הארגון נוצר בהצלחה!');
      setOpen(false);
      setName('');
      setSlug('');
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            ארגון חדש
          </Button>
        )}
      </DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>יצירת ארגון חדש</DialogTitle>
          <DialogDescription>
            ארגון מאפשר לך לנהל מספר אתרים תחת חשבון אחד
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם הארגון</Label>
            <Input
              id="name"
              placeholder="לדוגמה: המסעדה שלי"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">כתובת (URL)</Label>
            <div className="flex items-center gap-2" dir="ltr">
              <Input
                id="slug"
                placeholder="my-restaurant"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                pattern="[a-z0-9-]+"
                className="text-left"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">.amdir.app</span>
            </div>
            <p className="text-xs text-muted-foreground">
              רק אותיות באנגלית, מספרים ומקפים
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              צור ארגון
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
