import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pt-20">
      <Navbar activeTab="beats" onTabChange={() => {}} />

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-20">
        <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-ink">
          Erro 404
        </p>

        <h1 className="masthead font-display mt-5 text-[clamp(2.75rem,9vw,6rem)] font-bold text-foreground">
          Essa página
          <br />
          não existe
        </h1>

        <p className="mt-7 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
          O endereço <span className="font-mono-data text-ink">{location.pathname}</span> não
          leva a lugar nenhum. Pode ter sido removido ou o link veio quebrado.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="ink-btn inline-flex h-12 items-center px-6 text-sm">
            Ver o catálogo
          </Link>
          <Link to="/sobre" className="ink-ghost inline-flex h-12 items-center px-6 text-sm font-medium">
            Sobre
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
