import { ReactNode } from "react";
import SidebarAd from "./SidebarAd";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex justify-center min-h-screen bg-background">
      {/* Left sidebar ad - desktop only */}
      <div className="hidden xl:flex flex-col items-end pt-24 pr-4">
        <SidebarAd />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-4xl w-full">
        {children}
      </div>

      {/* Right sidebar ad - desktop only */}
      <div className="hidden xl:flex flex-col items-start pt-24 pl-4">
        <SidebarAd />
      </div>
    </div>
  );
};

export default PageLayout;
