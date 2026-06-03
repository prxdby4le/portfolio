import { Music, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  activeTab?: 'beats' | 'visualizers';
  onTabChange?: (tab: 'beats' | 'visualizers') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/sobre';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-white/20">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-aero-sky to-aero-green flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-base sm:text-lg">4</span>
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-gradient-sky">
              prxdby4le
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isHomePage && activeTab && onTabChange && (
              <div className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 glass rounded-lg">
                <Button
                  variant="tab"
                  size="sm"
                  data-state={activeTab === 'beats' ? 'active' : 'inactive'}
                  onClick={() => onTabChange('beats')}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-semibold",
                    activeTab === 'beats' 
                      ? "text-aero-sky bg-aero-sky/10" 
                      : "text-muted-foreground hover:text-aero-sky"
                  )}
                >
                  <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Beats</span>
                </Button>
                <Button
                  variant="tab"
                  size="sm"
                  data-state={activeTab === 'visualizers' ? 'active' : 'inactive'}
                  onClick={() => onTabChange('visualizers')}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-semibold",
                    activeTab === 'visualizers' 
                      ? "text-aero-green bg-aero-green/10" 
                      : "text-muted-foreground hover:text-aero-green"
                  )}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Visualizers</span>
                </Button>
              </div>
            )}
            
            <Link to="/sobre">
              <Button
                variant="tab"
                size="sm"
                className={cn(
                  "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-semibold border border-aero-sky/20 hover:border-aero-sky/40",
                  isAboutPage 
                    ? "text-aero-sky bg-aero-sky/10" 
                    : "text-muted-foreground hover:text-aero-sky"
                )}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sobre</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
