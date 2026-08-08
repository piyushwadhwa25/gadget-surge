import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';
import { Sun, Moon, Menu, X, Zap } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from '@/components/SearchBar';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories, getPopularTools } from '@/lib/tools-registry';

const navItems: { label: string; path: string; badge?: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'Developer Tools', path: '/category/developer-tools' },
  { label: 'Text Tools', path: '/category/text-tools' },
  { label: 'Image Tools', path: '/category/image-tools' },
  { label: 'All Tools', path: '/tools' },
  { label: 'Visual DB Builder', path: '/app/visual-db-builder', badge: 'Pro' },
];

export function Layout() {
  const { isDark, toggle } = useDarkMode();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const popular = getPopularTools().slice(0, 6);

  // Track SPA page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground tracking-tight">
                Gadget<span className="text-primary">Surge</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-4">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="ml-1">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" size="sm" className="ml-1">
                  <Link to="/login">Log In</Link>
                </Button>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <SearchBar className="hidden md:block w-64" />
              <button
                onClick={toggle}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <SearchBar className="mb-3" onSelect={() => setMobileMenuOpen(false)} />
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-4">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <div className="pt-2 space-y-2 border-t border-border">
                {user ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full justify-center">
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" size="sm" className="w-full justify-center">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-3">
        <AdPlaceholder />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <div className="container mx-auto px-4 py-3">
        <AdPlaceholder />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-card-foreground">
                  Gadget<span className="text-primary">Surge</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Free online tools for developers, creators, and everyday tasks. All tools run 100% in your browser.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Categories</h4>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat.name}
                      {cat.comingSoon && <span className="ml-1 text-accent text-xs">(Soon)</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Popular Tools</h4>
              <ul className="space-y-2">
                {popular.map(t => (
                  <li key={t.slug}>
                    <Link to={`/tools/${t.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Tools</Link></li>
                <li><Link to="/category/developer-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Developer Tools</Link></li>
                <li><Link to="/category/text-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Text Tools</Link></li>
                <li><Link to="/category/image-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Image Tools</Link></li>
                <li><Link to="/app/visual-db-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">Visual DB Builder</Link></li>
                <li>
                  {user ? (
                    <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                  ) : (
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Log In</Link>
                  )}
                </li>
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} GadgetSurge. All tools are free and run entirely in your browser.
          </div>
        </div>
      </footer>
    </div>
  );
}
