import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Quartos from "./pages/Quartos";
import Reservas from "./pages/Reservas";
import Hospedes from "./pages/Hospedes";
import Pagamentos from "./pages/Pagamentos";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/quartos" element={<ProtectedRoute><Quartos /></ProtectedRoute>} />
          <Route path="/reservas" element={<ProtectedRoute><Reservas /></ProtectedRoute>} />
          <Route path="/hospedes" element={<ProtectedRoute><Hospedes /></ProtectedRoute>} />
          <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
