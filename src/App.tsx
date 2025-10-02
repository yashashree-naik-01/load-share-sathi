import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MerchantLogin from "./pages/MerchantLogin";
import TruckLogin from "./pages/TruckLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import TruckDashboard from "./pages/TruckDashboard";
import Matches from "./pages/Matches";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/merchant-login" element={<MerchantLogin />} />
            <Route path="/truck-login" element={<TruckLogin />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/truck-dashboard" element={<TruckDashboard />} />
            <Route path="/matches/:loadId" element={<Matches />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
