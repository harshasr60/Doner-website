import { Link } from "react-router";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="size-8 text-rose-600 fill-rose-600" />
              <span className="font-bold text-xl text-white">WOMBTO18</span>
            </div>
            <p className="text-sm mb-4">
              Empowering communities and transforming lives through sustainable development and humanitarian aid.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-rose-600 transition-colors">
                <Facebook className="size-5" />
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors">
                <Instagram className="size-5" />
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-rose-600 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-rose-600 transition-colors">Services</Link></li>
              <li><Link to="/impact-reports" className="hover:text-rose-600 transition-colors">Impact Reports</Link></li>
              <li><Link to="/transparency" className="hover:text-rose-600 transition-colors">Transparency</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="hover:text-rose-600 transition-colors">Blog</Link></li>
              <li><Link to="/press" className="hover:text-rose-600 transition-colors">Press</Link></li>
              <li><Link to="/donor-wall" className="hover:text-rose-600 transition-colors">Donor Wall</Link></li>
              <li><Link to="/donate" className="hover:text-rose-600 transition-colors">Donate</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="size-5 flex-shrink-0 mt-0.5" />
                <span>123 NGO Street, Mumbai, Maharashtra 400001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-5 flex-shrink-0" />
                <a href="mailto:info@wombto18.org" className="hover:text-rose-600 transition-colors">
                  info@wombto18.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-5 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-rose-600 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} WOMBTO18. All rights reserved. | Registered under Section 80G and 12A</p>
        </div>
      </div>
    </footer>
  );
}
