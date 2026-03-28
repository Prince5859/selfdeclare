import { useState } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Custom Icon Components matching the reference style
const ImageToolsIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const ImageToPdfIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-orange-500">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

const ImageResizerIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-500">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
      <path d="M15 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>
  </div>
);

const PdfToJpgIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
      <rect x="3" y="6" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="11" y="8" width="10" height="10" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  </div>
);

const AgeCalcIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-600">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="16" r="2" fill="currentColor"/>
    </svg>
  </div>
);

const QrCodeIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-purple-600">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="4" height="4" fill="currentColor"/>
      <rect x="19" y="19" width="2" height="2" fill="currentColor"/>
      <rect x="14" y="19" width="2" height="2" fill="currentColor"/>
      <rect x="19" y="14" width="2" height="2" fill="currentColor"/>
    </svg>
  </div>
);

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const [imageToolsOpen, setImageToolsOpen] = useState(true);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!open && (
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-[60] bg-transparent hover:bg-transparent border-none shadow-none"
            aria-label="मेनू खोलें"
          >
            <Menu className="h-8 w-8 text-primary" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 pt-6">
        
        <nav className="p-4">
          <Collapsible
            open={imageToolsOpen}
            onOpenChange={setImageToolsOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <ImageToolsIcon />
                <span className="font-medium hindi-text">Image Tools</span>
              </div>
              {imageToolsOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pl-4 space-y-1">
              <Link
                to="/image-to-pdf"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <ImageToPdfIcon />
                <span className="text-sm hindi-text">Image to PDF</span>
              </Link>
              
              <Link
                to="/pdf-to-jpg"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <PdfToJpgIcon />
                <span className="text-sm hindi-text">PDF to JPG</span>
              </Link>
              
              <Link
                to="/image-resizer"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <ImageResizerIcon />
                <span className="text-sm hindi-text">Image Resizer</span>
              </Link>

              <Link
                to="/qr-code-generator"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <QrCodeIcon />
                <span className="text-sm hindi-text">QR Code Generator</span>
              </Link>

              <Link
                to="/age-calculator"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <AgeCalcIcon />
                <span className="text-sm hindi-text">Age Calculator</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Home Link */}
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 mt-4 rounded-lg hover:bg-accent/50 transition-colors border border-border"
          >
            <span className="text-sm hindi-text">🏠 घोषणा पत्र (होम)</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
