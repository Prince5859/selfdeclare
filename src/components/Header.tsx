import { Link, useLocation } from "react-router-dom";
import { FileText, Image, FileImage, Crop, Menu } from "lucide-react";
import { useState, useEffect } from "react";
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
import { ChevronDown, ChevronRight } from "lucide-react";

// Tool definitions
const tools = [
  { 
    path: "/image-to-pdf", 
    name: "Image to PDF",
    icon: FileText,
    colorClass: "text-primary",
    bgClass: "bg-primary/10"
  },
  { 
    path: "/pdf-to-jpg", 
    name: "PDF to JPG",
    icon: FileImage,
    colorClass: "text-accent-foreground",
    bgClass: "bg-accent"
  },
  { 
    path: "/image-resizer", 
    name: "Image Resizer",
    icon: Crop,
    colorClass: "text-primary",
    bgClass: "bg-secondary"
  },
];

// Custom Icon Components for side menu
const ImageToolsIcon = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageToolsOpen, setImageToolsOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Show hamburger menu on mobile/tablet for all pages, or on home page for desktop
  const showHamburger = isMobile || isHomePage;

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Hamburger (conditional) + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            {showHamburger && (
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-transparent hover:bg-transparent border-none shadow-none"
                    aria-label="मेनू खोलें"
                  >
                    <Menu className="h-6 w-6 text-primary" />
                  </Button>
                </SheetTrigger>
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
                        {tools.map((tool) => (
                          <Link
                            key={tool.path}
                            to={tool.path}
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                          >
                            <div className={`w-6 h-6 rounded-lg ${tool.bgClass} flex items-center justify-center`}>
                              <tool.icon className={`h-3.5 w-3.5 ${tool.colorClass}`} />
                            </div>
                            <span className="text-sm hindi-text">{tool.name}</span>
                          </Link>
                        ))}
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
            )}

            {/* Logo - Always clickable to home */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground hidden sm:block">
                GhoshnaPatra
              </span>
            </Link>
          </div>

          {/* Desktop Tools Navigation - Only on tool pages and desktop */}
          {!isHomePage && !isMobile && (
            <nav className="flex items-center gap-1">
              {tools.map((tool) => {
                const isActive = location.pathname === tool.path;
                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <tool.icon className="h-4 w-4" />
                    <span>{tool.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side - spacer for balance on home page */}
          {isHomePage && <div className="w-10" />}
        </div>
      </div>
    </header>
  );
};

export default Header;
