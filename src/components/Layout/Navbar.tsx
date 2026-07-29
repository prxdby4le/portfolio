import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab?: 'beats' | 'posts';
  onTabChange?: (tab: 'beats' | 'posts') => void;
}

/**
 * Solid, not frosted. A blurred bar over a two-ink page just muddies the
 * paper. Separation comes from a hairline. 72px tall, one line, always.
 */
export default function Navbar({ activeTab = 'beats', onTabChange }: NavbarProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/sobre';

  const tabClass = (active: boolean) =>
    cn(
      "relative h-10 px-1 text-sm font-medium tracking-tight transition-colors",
      "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:transition-colors",
      active
        ? "text-ink after:bg-ink"
        : "text-muted-foreground hover:text-foreground after:bg-transparent"
    );

  return (
    <>
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Pular para o conteúdo
      </a>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-paper">
        <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 transition-opacity group-hover:opacity-80"
            />
            <span className="font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-ink">
              prxdby4le
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {isHomePage && onTabChange && (
              <div className="flex items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => onTabChange('beats')}
                  aria-current={activeTab === 'beats' ? 'true' : undefined}
                  className={tabClass(activeTab === 'beats')}
                >
                  Beats
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('posts')}
                  aria-current={activeTab === 'posts' ? 'true' : undefined}
                  className={tabClass(activeTab === 'posts')}
                >
                  Posts
                </button>
              </div>
            )}

            <Link
              to="/sobre"
              aria-current={isAboutPage ? 'page' : undefined}
              className={tabClass(isAboutPage)}
            >
              Sobre
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
