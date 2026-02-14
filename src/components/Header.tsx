import { Link, useLocation } from "react-router";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/services", label: "Services" },
    { path: "/blog", label: "Blog" },
    { path: "/press", label: "Press" },
    { path: "/impact-reports", label: "Impact Reports" },
    { path: "/transparency", label: "Transparency" },
    { path: "/donor-wall", label: "Donor Wall" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="size-8 text-rose-600 fill-rose-600" />
            <span className="font-bold text-xl text-gray-900">WOMBTO18</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? "text-rose-600 font-semibold"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="size-6 text-gray-700" />
            ) : (
              <Menu className="size-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm ${
                  isActive(link.path)
                    ? "text-rose-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 bg-rose-600 text-white px-6 py-2 rounded-lg text-center"
            >
              Donate Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
