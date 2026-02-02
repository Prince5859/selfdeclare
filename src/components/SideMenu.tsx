import { useState } from "react";
import { Menu, ChevronDown, ChevronRight, Image, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const [imageToolsOpen, setImageToolsOpen] = useState(true);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border border-border shadow-md hover:bg-accent"
          aria-label="मेनू खोलें"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold hindi-text">
            टूल्स मेनू
          </SheetTitle>
        </SheetHeader>
        
        <nav className="p-4">
          <Collapsible
            open={imageToolsOpen}
            onOpenChange={setImageToolsOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-primary" />
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
                <FileImage className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm hindi-text">Image to PDF Converter</span>
              </Link>
              
              <Link
                to="/image-resizer"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <Image className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm hindi-text">Image Resizer</span>
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
