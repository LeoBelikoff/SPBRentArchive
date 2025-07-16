import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Map,
  FileText,
  Calendar,
  MessageCircle,
  Menu,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Главная",
    icon: <Home className="w-4 h-4" />,
    href: "/",
  },
  { label: "Карта", icon: <Map className="w-4 h-4" />, href: "/map" },
  {
    label: "Детали",
    icon: <FileText className="w-4 h-4" />,
    href: "/content/details",
  },
  {
    label: "Календарь",
    icon: <Calendar className="w-4 h-4" />,
    href: "/calendar",
  },
  {
    label: "Контакты",
    icon: <MessageCircle className="w-4 h-4" />,
    href: "/content/contacts",
  },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    // Clear auth and redirect
    localStorage.removeItem("apartment-rental-auth");
    navigate("/");
    window.location.reload();
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const handleNavClick = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname === href || location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-8xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-900">
                Центр Аренды Квартир
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin Button and Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Admin Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                onClick={handleAdminClick}
              >
                <Shield className="w-4 h-4 mr-2" />
                Админ
              </Button>

              {/* Logout button only shown on admin page */}
              {isAdminPage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                  onClick={handleLogout}
                  title="Выйти из админ-панели"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="py-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
                          isActiveRoute(item.href)
                            ? "bg-brand-orange/10 text-brand-orange"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
