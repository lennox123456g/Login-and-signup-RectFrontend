import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Type definition for language return object
type LngRet = {
  [key: string]: {
    nativeName: string;
  };
};

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [lngs, setLngs] = useState<LngRet>({
    en: { nativeName: 'English' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        // Check if backend connector exists before trying to use it
        if (i18n.services?.backendConnector?.backend?.getLanguages) {
          const ret: LngRet = await i18n.services.backendConnector.backend.getLanguages();
          setLngs(ret);
        } else {
          throw new Error('Backend connector not available');
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
        // Fallback to default languages if API fails
        setLngs({
          en: { nativeName: 'English' },
          es: { nativeName: 'Español' },
          fr: { nativeName: 'Français' },
          pt: { nativeName: 'Portuguese' }
        });
      } finally {
        setLoading(false);
      }
    };

    // Only run if i18n is ready
    if (i18n.isInitialized) {
      loadLanguages();
    } else {
      // Wait for i18n to initialize
      i18n.on('initialized', loadLanguages);
      return () => {
        i18n.off('initialized', loadLanguages);
      };
    }
  }, [i18n]);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading languages...</span>
      </div>
    );
  }

  return (
    <div className="language-selector">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {t('selectLanguage', 'Select Language')}
      </h3>
      
      {/* Dropdown Style */}
      <div className="mb-6">
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(lngs).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* Button Grid Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        {Object.entries(lngs).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              i18n.language === code
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      {/* Current Language Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          {t('currentLanguage', 'Current Language')}: 
          <span className="font-semibold text-gray-800 ml-1">
            {lngs[i18n.language]?.nativeName || i18n.language}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Language code: {i18n.language}
        </p>
      </div>

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
          Debug Info
        </summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify({ 
            currentLanguage: i18n.language,
            availableLanguages: Object.keys(lngs),
            languageData: lngs 
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default LanguageSelector;