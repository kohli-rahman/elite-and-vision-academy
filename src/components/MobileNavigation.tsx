
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, UserPlus, ClipboardList, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Add Capacitor type definition
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
    };
  }
}

export function MobileNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [safeAreaBottom, setSafeAreaBottom] = React.useState(0);
  
  React.useEffect(() => {
    // Check if running in a Capacitor app context
    const isNativeApp = window.Capacitor?.isNativePlatform() || false;
    
    if (isNativeApp) {
      // Use a timeout to ensure the safe area values are available after initial rendering
      setTimeout(() => {
        const safeAreaBottom = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--ion-safe-area-bottom') || '0', 10);
        setSafeAreaBottom(safeAreaBottom || 0);
      }, 500);
    }
  }, []);
  
  if (!isMobile) return null;
  
  return (
    <>
      <MobileMenu />
      <nav className={cn(
        "bottom-nav bg-gradient-to-r from-educational-primary to-educational-secondary text-white",
        safeAreaBottom > 0 && "pb-[env(safe-area-inset-bottom)]"
      )}>
        <NavItem 
          to="/" 
          icon={<Home className="bottom-nav-icon" />} 
          label="Home" 
          isActive={location.pathname === "/"} 
        />
        <NavItem 
          to="/admission" 
          icon={<UserPlus className="bottom-nav-icon" />} 
          label="Admission" 
          isActive={location.pathname === "/admission"} 
        />
        <NavItem 
          to="/tests" 
          icon={<ClipboardList className="bottom-nav-icon" />} 
          label="Tests" 
          isActive={location.pathname.includes("/tests")} 
        />
        <NavItem 
          to="/programs/1" 
          icon={<BookOpen className="bottom-nav-icon" />} 
          label="Programs" 
          isActive={location.pathname.includes("/programs")} 
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
      className={`bottom-nav-item ${isActive ? "bg-white/20 text-white rounded-lg" : "text-white/80"}`}
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
          className="fixed top-4 right-4 z-50 md:hidden bg-white/80 text-educational-primary hover:bg-white hover:text-educational-dark"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:max-w-sm border-r-educational-primary">
        <div className="flex flex-col gap-6 py-6">
          <h2 className="text-lg font-semibold text-educational-dark">Elite & Vision Academy</h2>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-base hover:text-educational-primary transition-colors">Home</Link>
            <Link to="/about" className="text-base hover:text-educational-primary transition-colors">About</Link>
            <Link to="/programs/1" className="text-base hover:text-educational-primary transition-colors">Programs</Link>
            <Link to="/tests" className="text-base hover:text-educational-primary transition-colors">Tests</Link>
            <Link to="/admission" className="text-base hover:text-educational-primary transition-colors">Admission</Link>
            <Link to="/auth" className="text-base hover:text-educational-primary transition-colors">Login/Register</Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
