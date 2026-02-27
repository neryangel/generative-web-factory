'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { CreateTenantDialog } from '@/components/tenant/CreateTenantDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Check,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const { tenants, currentTenant, setCurrentTenant } = useTenant();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
    { href: '/dashboard/sites', label: 'האתרים שלי', icon: Globe },
    { href: '/dashboard/settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-to-content">דלג לתוכן הראשי</a>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo & Tenant Selector */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block">AMDIR</span>
            </Link>

            {tenants.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="max-w-32 truncate">
                      {currentTenant?.name || 'בחר ארגון'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>הארגונים שלי</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => setCurrentTenant(tenant)}
                      className="gap-2"
                    >
                      {currentTenant?.id === tenant.id && (
                        <Check className="h-4 w-4" />
                      )}
                      <span className={currentTenant?.id !== tenant.id ? 'mr-6' : ''}>
                        {tenant.name}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <CreateTenantDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Plus className="ml-2 h-4 w-4" />
                      ארגון חדש
                    </DropdownMenuItem>
                  </CreateTenantDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Navigation */}
          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full min-h-[44px] min-w-[44px]" aria-label="תפריט משתמש">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>החשבון שלי</span>
                  <span className="text-xs font-normal text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="ml-2 h-4 w-4" />
                התנתק
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container px-4 py-8">
        {children}
      </main>
    </div>
  );
}
