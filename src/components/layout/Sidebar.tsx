import { Home, BedDouble, Calendar, Users, CreditCard, Menu, X, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BedDouble, label: "Quartos", path: "/quartos" },
  { icon: Calendar, label: "Reservas", path: "/reservas" },
  { icon: Users, label: "Hóspedes", path: "/hospedes" },
  { icon: CreditCard, label: "Pagamentos", path: "/pagamentos" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card shadow-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              Pousada <span className="text-sidebar-primary">Mão Preta</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-foreground font-semibold">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-accent-foreground">Usuário</p>
                <p className="text-xs text-sidebar-foreground">{user?.email || 'user@hotel.com'}</p>
              </div>
            </div>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full justify-start"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
