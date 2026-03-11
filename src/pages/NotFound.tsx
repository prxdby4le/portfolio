import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Stickers, { NOTFOUND_STICKERS } from "@/components/Stickers/Stickers";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="fixed inset-0 bg-psychedelic pointer-events-none" />
      <div className="fixed inset-0 stars-bg opacity-40 pointer-events-none" />
      
      {/* Notebook stickers */}
      <Stickers stickers={NOTFOUND_STICKERS} />

      <div className="text-center relative z-10">
        <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-rainbow animate-text-shadow-pop">
          404
        </h1>
        <p className="mb-4 text-xl text-y2k-cyan font-bold text-glow-cyan">
          ★ Oops! Página não encontrada ★
        </p>
        <p className="mb-6 text-y2k-pink/70 animate-blink font-bold">
          ~*~ essa página não existe ~*~
        </p>
        <Link 
          to="/" 
          className="y2k-btn inline-block px-6 py-3 rounded-xl font-bold text-white no-underline"
        >
          ✦ Voltar para Home ✦
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
