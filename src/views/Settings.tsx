import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Building2, Loader2, Shield, User } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { currentTenant, refetchTenants } = useTenant();
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ''
  );
  
  // Tenant state
  const [tenantName, setTenantName] = useState(currentTenant?.name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);

      toast.success('הפרופיל עודכן בהצלחה');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('שגיאה בעדכון הפרופיל');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ name: tenantName })
        .eq('id', currentTenant.id);

      if (error) throw error;

      await refetchTenants();
      toast.success('הארגון עודכן בהצלחה');
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      toast.error('שגיאה בעדכון הארגון');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">הגדרות</h1>
          <p className="text-muted-foreground">
            נהל את הפרופיל והארגון שלך
          </p>
        </div>

        <Tabs defaultValue="profile" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              פרופיל
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-4 w-4" />
              ארגון
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              אבטחה
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>פרטים אישיים</CardTitle>
                <CardDescription>
                  עדכן את פרטי החשבון שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {getInitials(fullName || user?.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName || 'משתמש'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">שם מלא</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="השם המלא שלך"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      לא ניתן לשנות את כתובת האימייל
                    </p>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    שמור שינויים
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>הגדרות ארגון</CardTitle>
                <CardDescription>
                  נהל את הארגון: {currentTenant?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTenant ? (
                  <form onSubmit={handleUpdateTenant} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tenantName">שם הארגון</Label>
                      <Input
                        id="tenantName"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        placeholder="שם הארגון"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>כתובת</Label>
                      <div className="flex items-center gap-2" dir="ltr">
                        <Input
                          value={currentTenant.slug}
                          disabled
                          className="bg-muted text-left"
                        />
                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          .amdir.app
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        לא ניתן לשנות את הכתובת
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>תוכנית</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {currentTenant.plan === 'free' ? 'חינמי' : currentTenant.plan}
                        </span>
                      </div>
                    </div>

                    <Button type="submit" disabled={saving || currentTenant.role !== 'owner'}>
                      {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      שמור שינויים
                    </Button>
                    
                    {currentTenant.role !== 'owner' && (
                      <p className="text-xs text-muted-foreground">
                        רק בעל הארגון יכול לערוך את ההגדרות
                      </p>
                    )}
                  </form>
                ) : (
                  <p className="text-muted-foreground">אין ארגון נבחר</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>אבטחה</CardTitle>
                <CardDescription>
                  הגדרות אבטחה וסיסמה
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>שינוי סיסמה</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    לשינוי הסיסמה, נשלח לך אימייל עם קישור
                  </p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!user?.email) return;
                      const { error } = await supabase.auth.resetPasswordForEmail(
                        user.email,
                        { redirectTo: window.location.origin }
                      );
                      if (error) {
                        toast.error('שגיאה בשליחת האימייל');
                      } else {
                        toast.success('נשלח אימייל לאיפוס סיסמה');
                      }
                    }}
                  >
                    שלח קישור לאיפוס סיסמה
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <Label className="text-destructive">אזור מסוכן</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    מחיקת החשבון תמחק את כל הנתונים לצמיתות
                  </p>
                  <Button variant="destructive" disabled>
                    מחק חשבון
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
