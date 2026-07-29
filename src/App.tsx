import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import TrackDetail from "./pages/TrackDetail";
import PostDetail from "./pages/PostDetail";
import { PlayerProvider, usePlayer } from "./contexts/PlayerContext";
import AudioPlayer from "./components/Player/AudioPlayer";
import DitherDefs from "./components/Duotone/DitherDefs";

const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* url(#duotone-*) targets. Must be in the document before anything
          referencing them paints. */}
      <DitherDefs />
      {/* One grain layer for the whole site. Fixed and pointer-events-none so
          it never repaints with scroll. */}
      <div className="press-grain" aria-hidden="true" />
      <Toaster />
      <Sonner />
      <PlayerProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/track/:id" element={<TrackDetail />} />
            <Route path="/post/:id" element={<PostDetail />} />
            
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AudioPlayer />
        </BrowserRouter>
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
