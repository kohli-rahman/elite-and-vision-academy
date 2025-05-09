import { Link } from 'react-router-dom';
import { Facebook, Instagram, LinkedIn, Mail, MapPin, Phone } from 'lucide-react';

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
              <a
                href="https://chat.whatsapp.com/KrtF4AdzCew6FJwF2qhYWE"
                target="_blank"
                rel="noopener noreferrer"
                title="Join our WhatsApp Group"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.52 3.48A11.85 11.85 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.12.55 4.13 1.6 5.94L0 24l6.25-1.63a11.96 11.96 0 0 0 5.76 1.46h.01c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.5-8.35ZM12.01 22.1h-.01a10.08 10.08 0 0 1-5.13-1.42l-.37-.22-3.7.96.99-3.6-.24-.38a9.94 9.94 0 0 1-1.56-5.36c0-5.51 4.49-10 10-10a9.96 9.96 0 0 1 7.08 2.92A9.93 9.93 0 0 1 22 12c0 5.51-4.49 10-9.99 10.1Zm5.72-7.48c-.31-.16-1.85-.91-2.14-1.02-.29-.11-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.23-.68.08a8.3 8.3 0 0 1-2.43-1.5 9.2 9.2 0 0 1-1.7-2.12c-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.07-.16-.71-1.7-.98-2.34-.26-.62-.53-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.39s-1.1 1.07-1.1 2.61 1.13 3.03 1.29 3.24c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.65.75.24 1.44.21 1.98.13.61-.09 1.85-.76 2.11-1.49.26-.72.26-1.34.18-1.49-.08-.16-.29-.23-.6-.39Z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/the_i_vision_institute?igsh=MTd6OXhlMm01bGd1YQ==" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/elite-academy-buxar/" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-educational-primary hover:text-white transition-colors">
                <LinkedIn className="h-4 w-4" />
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

