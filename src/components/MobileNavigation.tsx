
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, BookOpen, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <>
      <MobileMenu />
      <nav className="bottom-nav safe-area-bottom">
        <NavItem 
          to="/" 
          icon={<Home className="bottom-nav-icon" />} 
          label="Home" 
          isActive={location.pathname === "/"} 
        />
        <NavItem 
          to="/about" 
          icon={<Info className="bottom-nav-icon" />} 
          label="About" 
          isActive={location.pathname === "/about"} 
        />
        <NavItem 
          to="/programs/1" 
          icon={<BookOpen className="bottom-nav-icon" />} 
          label="Programs" 
          isActive={location.pathname.includes("/programs")} 
        />
        <NavItem 
          to="/admission" 
          icon={<User className="bottom-nav-icon" />} 
          label="Admission" 
          isActive={location.pathname === "/admission"} 
        />
      </nav>
    </>
  );
}

function NavItem({ 
  to, 
  icon, 
  label, 
  isActive 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
}) {
  return (
    <Link 
      to={to} 
      className={`bottom-nav-item ${isActive ? "text-primary" : "text-muted-foreground"}`}
    >
      {icon}
      <span className="bottom-nav-label">{label}</span>
    </Link>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 z-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:max-w-sm">
        <div className="flex flex-col gap-6 py-6">
          <h2 className="text-lg font-semibold">Excellence Academy</h2>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-base hover:text-primary">Home</Link>
            <Link to="/about" className="text-base hover:text-primary">About</Link>
            <Link to="/programs/1" className="text-base hover:text-primary">Programs</Link>
            <Link to="/tests" className="text-base hover:text-primary">Tests</Link>
            <Link to="/admission" className="text-base hover:text-primary">Admission</Link>
            <Link to="/auth" className="text-base hover:text-primary">Login/Register</Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
