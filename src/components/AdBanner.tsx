import { useRef, useEffect, useState } from "react";

// Responsive Adsterra Ad Component - Mobile 320x50, Desktop 728x90
const AdBanner = () => {
  const mobileAdRef = useRef<HTMLDivElement>(null);
  const desktopAdRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const mobileAdLoaded = useRef(false);
  const desktopAdLoaded = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Mobile Ad - 320x50
    if (isMobile && mobileAdRef.current && !mobileAdLoaded.current) {
      mobileAdLoaded.current = true;
      (window as any).atOptions = {
        'key': 'd98482b0935791ef833a2417eb9c4900',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/d98482b0935791ef833a2417eb9c4900/invoke.js';
      script.async = true;
      mobileAdRef.current.appendChild(script);
    }

    // Desktop Ad - 728x90
    if (!isMobile && desktopAdRef.current && !desktopAdLoaded.current) {
      desktopAdLoaded.current = true;
      (window as any).atOptions = {
        'key': 'c00469cb94eb0adb924b5a29ad345568',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/c00469cb94eb0adb924b5a29ad345568/invoke.js';
      script.async = true;
      desktopAdRef.current.appendChild(script);
    }
  }, [isMobile]);

  return (
    <div className="my-6 w-full overflow-hidden">
      {/* Mobile Ad - 320x50 */}
      {isMobile && (
        <div 
          ref={mobileAdRef}
          className="flex justify-center items-center rounded-lg mx-auto"
          style={{ width: '100%', maxWidth: '320px', height: '50px' }}
        />
      )}
      {/* Desktop Ad - 728x90 */}
      {!isMobile && (
        <div 
          ref={desktopAdRef}
          className="flex justify-center items-center rounded-lg mx-auto"
          style={{ width: '100%', maxWidth: '728px', height: '90px' }}
        />
      )}
    </div>
  );
};

export default AdBanner;
