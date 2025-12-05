'use client';

import { useTranslations } from 'next-intl';
import { Container as MapDiv, NaverMap, Marker, NavermapsProvider } from 'react-naver-maps';

export default function LocationPage() {
  const t = useTranslations('CompanyPage');

  // Coordinates for: 경기 화성시 양감면 토성로 579-17
  // Approx: 37.095, 126.935 (Need exact coords, using approx for now)
  const center = { lat: 37.0955, lng: 126.9355 };

  return (
    <div className="flex flex-col gap-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Map Section */}
        <div className="w-full h-[400px] md:h-[500px] relative bg-gray-100 dark:bg-gray-700">
          <NavermapsProvider
            ncpClientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || 'YOUR_CLIENT_ID_HERE'}
          >
            <MapDiv
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <NaverMap
                defaultCenter={center}
                defaultZoom={15}
              >
                <Marker position={center} />
              </NaverMap>
            </MapDiv>
          </NavermapsProvider>

          {/* API Key Warning (Visible only if key is missing) */}
          {!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center z-10">
              <div>
                <p className="font-bold text-lg mb-2">Naver Map API Key Required</p>
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
              <p><span className="font-semibold text-gray-900 dark:text-white w-16 inline-block">도로명</span> {t('address_road')}</p>
              <p><span className="font-semibold text-gray-900 dark:text-white w-16 inline-block">지번</span> {t('address_lot')}</p>
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

      {/* Transport Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-10">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('transport_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300">
              🚗
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('transport_car')}</h4>
              <p className="text-gray-600 dark:text-gray-300">{t('transport_car_desc')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-300">
              🚌
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('transport_public')}</h4>
              <p className="text-gray-600 dark:text-gray-300">{t('transport_public_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
