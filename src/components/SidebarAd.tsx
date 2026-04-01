import { useRef, useEffect } from "react";

const SidebarAd = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (adRef.current && !loaded.current) {
      loaded.current = true;
      (window as any).atOptions = {
        'key': 'b723e4ae98e4cb54788e2f1bb4f2a8c5',
        'format': 'iframe',
        'height': 300,
        'width': 160,
        'params': {}
      };
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/b723e4ae98e4cb54788e2f1bb4f2a8c5/invoke.js';
      script.async = true;
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={adRef}
      className="hidden xl:block sticky top-24"
      style={{ width: 160, height: 300, minHeight: 300 }}
    />
  );
};

export default SidebarAd;
