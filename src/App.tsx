import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ImageResizer from "./pages/ImageResizer";
import ImageToPdf from "./pages/ImageToPdf";
import PdfToJpg from "./pages/PdfToJpg";
import QrCodeGenerator from "./pages/QrCodeGenerator";
import AgeCalculator from "./pages/AgeCalculator";
import CaptionGenerator from "./pages/CaptionGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/qr-code-generator" element={<QrCodeGenerator />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/caption-generator" element={<CaptionGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
