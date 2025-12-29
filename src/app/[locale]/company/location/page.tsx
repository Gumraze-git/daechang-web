'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

export default function LocationPage() {
  const t = useTranslations('CompanyPage');
  const locale = useLocale();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Exact coordinates (Daechang Machinery Industry)
  const center = { lat: 37.10858, lng: 126.9773 };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    if (!clientId) return;

    // Initialization function
    const initMap = () => {
      // Check if Naver Maps API is fully loaded and container exists
      if (window.naver && window.naver.maps && mapRef.current) {
        try {
          // Check if map is already initialized in this container to prevent duplicates
          // If we are reloading for language change, we might want to clear it first
          if (mapRef.current.hasChildNodes()) {
            // If the language changed, we might need to recreate the map instance? 
            // Actually, the API script change should handle the tiles/labels. 
            // But we need to make sure the map instance uses the new resources.
            // Simpler to just clear and re-render if we suspect a change, 
            // but checking hasChildNodes is usually for initial load.
            // Let's assume on script reload the previous instance might be invalid or we just create a new one.
            mapRef.current.innerHTML = '';
          }

          const location = new window.naver.maps.LatLng(center.lat, center.lng);
          const mapOptions = {
            center: location,
            zoom: 17, // Adjusted zoom slightly
            minZoom: 10,
            zoomControl: true,
            zoomControlOptions: {
              position: window.naver.maps.Position.TOP_RIGHT
            }
          };

          const map = new window.naver.maps.Map(mapRef.current, mapOptions);

          new window.naver.maps.Marker({
            position: location,
            map: map
          });

          setIsMapLoaded(true);
          return true; // Success
        } catch (e) {
          console.error("Map initialization failed", e);
          return false;
        }
      }
      return false; // Not ready yet
    };

    // Script Loading Logic
    const scriptId = 'naver-map-script';
    const targetLanguage = locale === 'ko' ? 'ko' : 'en';
    const scriptSrc = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&language=${targetLanguage}`;

    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (script) {
      // If script exists but source URL (language) is different, remove it to reload
      if (script.src !== scriptSrc) {
        document.head.removeChild(script);
        script = null as any;
        // Clean up global object if we are reloading script
        // This forces re-initialization
        // window.naver = undefined; // Be careful with this, but it might be needed.
      }
    }

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }

    // Try initializing immediately 
    if (initMap()) return;

    // Polling strategy
    const intervalId = setInterval(() => {
      if (initMap()) {
        clearInterval(intervalId);
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [locale]); // Re-run effect when locale changes

  return (
    <div className="flex flex-col gap-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Map Section */}
        <div className="w-full h-[400px] md:h-[500px] relative bg-gray-100 dark:bg-gray-700">
          <div ref={mapRef} className="w-full h-full" />

          {!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID && (
            /* API Key Warning (Visible only if key is missing) */
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center z-10">
              <div>
                <p className="font-bold text-lg mb-2">Naver Map Client ID Required</p>
                <p className="text-sm">Please set NEXT_PUBLIC_NAVER_MAP_CLIENT_ID in your .env file.</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
              {t('address_title')}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white w-20 inline-block">{t('label_road')}</span>
                <a
                  href="https://map.naver.com/p/search/%EB%8C%80%EC%B0%BD%EA%B8%B0%EA%B3%84%EC%82%B0%EC%97%85/place/21093911?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202512252110&locale=ko&svcName=map_pcv5&searchText=%EB%8C%80%EC%B0%BD%EA%B8%B0%EA%B3%84%EC%82%B0%EC%97%85"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                >
                  {t('address_road')}
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white w-20 inline-block">{t('label_lot')}</span>
                <a
                  href="https://map.naver.com/p/search/%EB%8C%80%EC%B0%BD%EA%B8%B0%EA%B3%84%EC%82%B0%EC%97%85/place/21093911?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202512252110&locale=ko&svcName=map_pcv5&searchText=%EB%8C%80%EC%B0%BD%EA%B8%B0%EA%B3%84%EC%82%B0%EC%97%85"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                >
                  {t('address_lot')}
                </a>
              </p>
              <p><span className="font-semibold text-gray-900 dark:text-white w-20 inline-block">{t('label_zip')}</span> {t('zip_code')}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
              {t('contact_title')}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><span className="font-semibold text-gray-900 dark:text-white w-16 inline-block">{t('phone')}</span> 031-353-1234</p>
              <p><span className="font-semibold text-gray-900 dark:text-white w-16 inline-block">{t('fax')}</span> 031-353-5678</p>
              <p><span className="font-semibold text-gray-900 dark:text-white w-16 inline-block">{t('email')}</span> info@daechang.co.kr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
