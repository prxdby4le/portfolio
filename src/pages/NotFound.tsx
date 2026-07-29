import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-gradient-sky">
          404
        </h1>
        <p className="mb-4 text-xl text-aero-sky font-semibold">
          Oops! Página não encontrada
        </p>
        <p className="mb-6 text-muted-foreground font-medium">
          Essa página não existe
        </p>
        <Link 
          to="/" 
          className="aero-btn inline-block px-6 py-3 rounded-xl font-semibold text-white no-underline"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
