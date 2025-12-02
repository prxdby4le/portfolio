import { Music, Eye, User } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-fruity flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-background font-bold text-lg">4</span>
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-fruity bg-clip-text text-transparent">
              prxdby4le
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {!isAboutPage && (
              <div className="flex items-center gap-2 p-1 glass rounded-lg">
                <Button
                  variant="tab"
                  size="sm"
                  data-state={activeTab === 'beats' ? 'active' : 'inactive'}
                  onClick={() => onTabChange('beats')}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    activeTab === 'beats' && "text-glow-lime"
                  )}
                >
                  <Music className="w-4 h-4" />
                  Beats
                </Button>
                <Button
                  variant="tab"
                  size="sm"
                  data-state={activeTab === 'visualizers' ? 'active' : 'inactive'}
                  onClick={() => onTabChange('visualizers')}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    activeTab === 'visualizers' && "text-glow-purple"
                  )}
                >
                  <Eye className="w-4 h-4" />
                  Visualizers
                </Button>
              </div>
            )}
            
            <Link to="/sobre">
              <Button
                variant="tab"
                size="sm"
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  isAboutPage && "text-glow-orange"
                )}
              >
                <User className="w-4 h-4" />
                Sobre
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}