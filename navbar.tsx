import { Link, useLocation } from "wouter";
import { Trophy, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/hooks/useAuth"; // Removed for public demo
import { useState } from "react";

export default function Navbar() {
  // const { user } = useAuth(); // Removed for public demo
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", active: location === "/" },
    { path: "/draft", label: "Draft", active: location === "/draft" },
    { path: "/schedule", label: "Schedule", active: location === "/schedule" },
    { path: "/standings", label: "Standings", active: location === "/standings" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Omni League</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-medium transition-colors ${
                  item.active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5" />
              <span>Demo User</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = "/api/logout"}
            >
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-2 text-base font-medium transition-colors ${
                    item.active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" />
                  <span>Demo User</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
