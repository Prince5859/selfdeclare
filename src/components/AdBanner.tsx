import { useRef, useEffect, useState } from "react";

// Responsive Adsterra Ad Component - Mobile 320x50, Desktop 728x90
const AdBanner = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const adLoaded = useRef(false);
  const currentAdType = useRef<'mobile' | 'desktop' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const adType = isMobile ? 'mobile' : 'desktop';
    
    // Only load if not already loaded for this type
    if (adContainerRef.current && (!adLoaded.current || currentAdType.current !== adType)) {
      // Clear previous ad
      adContainerRef.current.innerHTML = '';
      adLoaded.current = true;
      currentAdType.current = adType;

      if (isMobile) {
        // Mobile Ad - 320x50
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
        adContainerRef.current.appendChild(script);
      } else {
        // Desktop Ad - 728x90
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
        adContainerRef.current.appendChild(script);
      }
    }
  }, [isMobile]);

  return (
    <div className="my-6">
      <div 
        ref={adContainerRef}
        className="flex justify-center items-center rounded-lg mx-auto"
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
