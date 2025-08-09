import React from 'react';
import { useTranslation } from 'react-i18next';

const Translate = () => {
  const { t, i18n } = useTranslation();

  // Language switcher function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center mt-15">
      {/* Language Switcher */}
      <div class="flex justify-center gap-4 mb-6 md:mt-10 mt-30">
        <button
          onClick={() => changeLanguage('en')}
          class={`px-4 py-2 rounded-md font-medium transition-colors ${
            i18n.language === 'en'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-red-700 hover:bg-gray-300'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('fr')}
          class={`px-4 py-2 rounded-md font-medium transition-colors ${
            i18n.language === 'fr'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-red-700 hover:bg-gray-300'
          }`}
        >
          Français
        </button>
      </div>

      {/* Content */}
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-3">
          {t('welcome')}
        </h1>
        <p class="text-gray-600 text-lg">
          {t('description')}
        </p>
      </div>

      {/* Action Buttons */}
      <div class="flex justify-center gap-4">
        <button class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium">
          {t('buttons.submit')}
        </button>
        <button class="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium">
          {t('buttons.cancel')}
        </button>
      </div>

      {/* Current Language Indicator */}
      <div class="mt-4 text-center text-sm text-gray-500">
        Current language: {i18n.language.toUpperCase()}
      </div>

      {/* Additional Features Demo */}
      <div class="mt-6 p-4 bg-gray-50 rounded-md  w-full md:max-w-screen max-w-sm   ">
        <h1 class="text-sm md:text-md font-bold text-red-500 mb-2 line-clamp-1 md:pl-10">           
          Wait for more Language Translation Features!         
        </h1>
        {/*<div class="text-xs text-gray-600 space-y-1 line-clamp-1">
          <div>welcome: "{t('welcome')}"</div>
          <div>description: "{t('description')}"</div>
          <div>buttons.submit: "{t('buttons.submit')}"</div>
          <div>buttons.cancel: "{t('buttons.cancel')}"</div>
        </div>*/}
      </div>
    </div>
  );
};

export default Translate;