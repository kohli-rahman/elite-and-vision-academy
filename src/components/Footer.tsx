
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-educational-dark text-white border-t border-educational-primary/30">
      <div className="section-container pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-display font-bold tracking-tight">
                Elite & Vision<span className="text-educational-secondary">Academy</span>
              </span>
            </Link>
            <p className="text-white/80 mb-4 text-sm">
              Elite & Vision Academy is dedicated to helping students achieve their full potential through personalized coaching and mentorship programs.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/elitevision.buxar/" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/elite-academy-buxar/" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-base mb-4 text-educational-light">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/programs" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Programs</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/team" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Our Team</Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Testimonials</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Programs */}
          <div>
            <h3 className="font-medium text-base mb-4 text-educational-light">Our Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/programs/academic" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Academic Excellence</Link>
              </li>
              <li>
                <Link to="/programs/test-prep" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Test Preparation</Link>
              </li>
              <li>
                <Link to="/programs/career" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Career Development</Link>
              </li>
              <li>
                <Link to="/programs/leadership" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Leadership Training</Link>
              </li>
              <li>
                <Link to="/programs/skill" className="text-white/70 hover:text-educational-secondary transition-colors text-sm">Skill Enhancement</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-medium text-base mb-4 text-educational-light">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-educational-secondary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  PP road, near ICICI bank, Buxar, Bihar, 802101
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-educational-secondary flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  +91 9110112530
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-educational-secondary flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  elitevision.buxar@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/50 text-sm">
              © {currentYear} Elite & Vision Academy. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-white/50 hover:text-educational-secondary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/50 hover:text-educational-secondary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
