import { Music, Eye, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  activeTab: 'beats' | 'visualizers';
  onTabChange: (tab: 'beats' | 'visualizers') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const location = useLocation();
  const isAboutPage = location.pathname === '/sobre';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b-2 border-y2k-pink/50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-y2k-pink to-y2k-cyan flex items-center justify-center shadow-lg animate-wobble group-hover:animate-spin-slow">
              <span className="text-black font-bold text-base sm:text-lg">4</span>
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-rainbow">
              prxdby4le
            </h1>
            <Star className="w-4 h-4 text-y2k-yellow animate-star-twinkle" />
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAboutPage && (
              <div className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 glass rounded-lg border border-y2k-pink/30">
                <Button
                  variant="tab"
                  size="sm"
                  data-state={activeTab === 'beats' ? 'active' : 'inactive'}
                  onClick={() => onTabChange('beats')}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-bold",
                    activeTab === 'beats' 
                      ? "text-y2k-pink text-glow-pink bg-y2k-pink/10" 
                      : "text-y2k-cyan hover:text-y2k-pink"
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
                    "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-bold",
                    activeTab === 'visualizers' 
                      ? "text-y2k-cyan text-glow-cyan bg-y2k-cyan/10" 
                      : "text-y2k-pink hover:text-y2k-cyan"
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
                  "flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 font-bold border border-y2k-yellow/30 hover:border-y2k-yellow",
                  isAboutPage 
                    ? "text-y2k-yellow text-glow-orange bg-y2k-yellow/10" 
                    : "text-y2k-yellow/70 hover:text-y2k-yellow"
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
