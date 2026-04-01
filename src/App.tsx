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
import SipCalculator from "./pages/SipCalculator";
import PageLayout from "./components/PageLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image-resizer" element={<PageLayout><ImageResizer /></PageLayout>} />
          <Route path="/image-to-pdf" element={<PageLayout><ImageToPdf /></PageLayout>} />
          <Route path="/pdf-to-jpg" element={<PageLayout><PdfToJpg /></PageLayout>} />
          <Route path="/qr-code-generator" element={<PageLayout><QrCodeGenerator /></PageLayout>} />
          <Route path="/age-calculator" element={<PageLayout><AgeCalculator /></PageLayout>} />
          <Route path="/caption-generator" element={<PageLayout><CaptionGenerator /></PageLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
