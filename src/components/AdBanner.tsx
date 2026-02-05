 import { useEffect, useRef, useState } from "react";
 import { useIsMobile } from "@/hooks/use-mobile";
 
 // Responsive Adsterra Ad Component - Mobile 320x50, Desktop 728x90
 // Uses direct iframe embedding to prevent redirect ads
 const AdBanner = () => {
   const isMobile = useIsMobile();
   const containerRef = useRef<HTMLDivElement>(null);
   const [adLoaded, setAdLoaded] = useState(false);
 
   useEffect(() => {
     // Reset ad when mobile state changes
     setAdLoaded(false);
   }, [isMobile]);
 
   useEffect(() => {
     if (adLoaded || !containerRef.current) return;
     
     // Clear previous content
     containerRef.current.innerHTML = '';
     
     // Create iframe directly to avoid redirect scripts
     const iframe = document.createElement('iframe');
     
     if (isMobile) {
       // Mobile Ad - 320x50
       iframe.src = 'https://www.highperformanceformat.com/watchnew?key=d98482b0935791ef833a2417eb9c4900';
       iframe.width = '320';
       iframe.height = '50';
     } else {
       // Desktop Ad - 728x90
       iframe.src = 'https://www.highperformanceformat.com/watchnew?key=c00469cb94eb0adb924b5a29ad345568';
       iframe.width = '728';
       iframe.height = '90';
     }
     
     iframe.frameBorder = '0';
     iframe.scrolling = 'no';
     iframe.style.border = 'none';
     iframe.style.overflow = 'hidden';
     // Sandbox to prevent redirects and popups
     iframe.sandbox.add('allow-scripts', 'allow-same-origin');
     
     containerRef.current.appendChild(iframe);
     setAdLoaded(true);
   }, [isMobile, adLoaded]);
 
   return (
     <div className="my-6 flex justify-center">
       <div 
         ref={containerRef}
         className="flex justify-center items-center rounded-lg overflow-hidden"
         style={{ 
           width: isMobile ? '320px' : '728px', 
           height: isMobile ? '50px' : '90px',
           minHeight: isMobile ? '50px' : '90px'
         }}
       />
     </div>
   );
 };
 
 export default AdBanner;
