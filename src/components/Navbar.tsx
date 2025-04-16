
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import AuthStatus from './AuthStatus';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      
      // Check if user is admin
      setIsAdmin(currentUser?.email === '2201cs58_rahul@iitp.ac.in');
    };
    
    checkUser();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'About Us', path: '/about' },
    { 
      name: 'Contact', 
      path: '/contact',
      icon: <Phone className="mr-2 h-4 w-4" /> 
    },
    { name: 'Tests', path: '/tests' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-bold tracking-tight text-foreground">
                Elite & Vision<span className="text-primary">Academy</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.name === 'Contact' ? (
                <Popover key={link.name}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive(link.path) 
                          ? 'text-primary' 
                          : 'text-foreground/80'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white shadow-lg rounded-lg">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">+91 9110112530</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">elite_academy_buxar@gmail.com</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          PP road, near ICICI bank, Buxar, Bihar, 802101
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) 
                      ? 'text-primary' 
                      : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <AuthStatus />
          </nav>
          
          <div className="flex md:hidden items-center space-x-4">
            <div className="md:hidden">
              <AuthStatus />
            </div>
            <button
              type="button"
              className="text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
