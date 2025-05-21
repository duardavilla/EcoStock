
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Empresas from "./pages/Empresas";
import Produtos from "./pages/Produtos";
import Categorias from "./pages/Categorias";
import Trocas from "./pages/Trocas";
import Comunicacoes from "./pages/Comunicacoes";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/LoginForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rotas protegidas com layout da aplicação */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/empresas" element={<AppLayout><Empresas /></AppLayout>} />
          <Route path="/produtos" element={<AppLayout><Produtos /></AppLayout>} />
          <Route path="/categorias" element={<AppLayout><Categorias /></AppLayout>} />
          <Route path="/trocas" element={<AppLayout><Trocas /></AppLayout>} />
          <Route path="/comunicacoes" element={<AppLayout><Comunicacoes /></AppLayout>} />
          <Route path="/" element={<LoginForm/>} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
