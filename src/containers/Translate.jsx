import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector'; // Import your LanguageSelector component

const Translate = () => {
  const { t, i18n } = useTranslation();
  const [translationSource, setTranslationSource] = useState('unknown');
  const [backendInfo, setBackendInfo] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    newsletter: false
  });

  // Check translation source and backend info
  useEffect(() => {
    const checkTranslationSource = () => {
      // Check if using Locize backend
      if (i18n.services?.backendConnector?.backend) {
        const backend = i18n.services.backendConnector.backend;
        setTranslationSource('locize');
        setBackendInfo({
          type: backend.constructor.name,
          projectId: backend.options?.projectId || 'unknown',
          apiKey: backend.options?.apiKey ? '***hidden***' : 'not set',
          loadPath: backend.options?.loadPath || 'unknown',
          addPath: backend.options?.addPath || 'unknown'
        });
      } else {
        setTranslationSource('static/fallback');
        setBackendInfo({ type: 'No backend connector found' });
      }
    };

    if (i18n.isInitialized) {
      checkTranslationSource();
    } else {
      i18n.on('initialized', checkTranslationSource);
      return () => i18n.off('initialized', checkTranslationSource);
    }
  }, [i18n]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(t('form.submitSuccess', 'Form submitted successfully!'));
  };

  const handleInputChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {t('header.title', 'Multilingual Demo App')}
              </h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {t('header.status', 'Live Translations')}
              </span>
            </div>
            <nav className="flex space-x-6">
              <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.home', 'Home')}
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.about', 'About')}
              </a>
              <a href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.services', 'Services')}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.contact', 'Contact')}
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Translation Source Info */}
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            {t('debug.translationSource', 'Translation Source')}
          </h3>
          <div className="text-sm text-yellow-700">
            <p><strong>{t('debug.source', 'Source')}:</strong> {translationSource}</p>
            <p><strong>{t('debug.currentLanguage', 'Current Language')}:</strong> {i18n.language}</p>
            <p><strong>{t('debug.isLocize', 'Using Locize')}:</strong> {translationSource === 'locize' ? t('common.yes', 'Yes') : t('common.no', 'No')}</p>
            {backendInfo && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">
                  {t('debug.backendDetails', 'Backend Details')}
                </summary>
                <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto">
                  {JSON.stringify(backendInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('hero.title', 'Welcome to Our Platform')}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {t('hero.subtitle', 'Experience seamless multilingual communication with real-time translations powered by Locize.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  {t('hero.getStarted', 'Get Started')}
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {t('hero.learnMore', 'Learn More')}
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('features.title', 'Key Features')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {t('features.realTime.title', 'Real-time Translation')}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {t('features.realTime.description', 'Instant language switching with live content updates from Locize backend.')}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    {t('features.multiLanguage.title', 'Multi-language Support')}
                  </h4>
                  <p className="text-green-700 text-sm">
                    {t('features.multiLanguage.description', 'Support for multiple languages with proper fallbacks and error handling.')}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    {t('features.userFriendly.title', 'User-Friendly Interface')}
                  </h4>
                  <p className="text-purple-700 text-sm">
                    {t('features.userFriendly.description', 'Intuitive design with seamless language switching experience.')}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    {t('features.cloudBased.title', 'Cloud-Based')}
                  </h4>
                  <p className="text-orange-700 text-sm">
                    {t('features.cloudBased.description', 'Powered by Locize cloud infrastructure for reliable translation delivery.')}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.title', 'Get in Touch')}
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.name.label', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('form.name.placeholder', 'Enter your full name')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.email.label', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('form.email.placeholder', 'Enter your email')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.country.label', 'Country')}
                  </label>
                  <select
                    id="country"
                    value={userForm.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t('form.country.placeholder', 'Select your country')}</option>
                    <option value="us">{t('countries.us', 'United States')}</option>
                    <option value="uk">{t('countries.uk', 'United Kingdom')}</option>
                    <option value="fr">{t('countries.fr', 'France')}</option>
                    <option value="de">{t('countries.de', 'Germany')}</option>
                    <option value="es">{t('countries.es', 'Spain')}</option>
                    <option value="pt">{t('countries.pt', 'Portugal')}</option>
                    <option value="br">{t('countries.br', 'Brazil')}</option>
                    <option value="sa">{t('countries.sa', 'Saudi Arabia')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.message.label', 'Message')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={userForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={t('form.message.placeholder', 'Tell us about your project or inquiry...')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={userForm.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                    {t('form.newsletter.label', 'Subscribe to our newsletter for updates')}
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('form.submit', 'Send Message')}
                </button>
              </form>
            </section>

            {/* Statistics */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('stats.title', 'Our Impact')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                  <div className="text-gray-600">{t('stats.users', 'Active Users')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-gray-600">{t('stats.languages', 'Languages Supported')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">{t('stats.uptime', 'Service Uptime')}</div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <LanguageSelector />
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('sidebar.quickInfo.title', 'Quick Information')}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sidebar.quickInfo.currentTime', 'Current Time')}:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sidebar.quickInfo.version', 'Version')}:</span>
                  <span className="font-medium">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sidebar.quickInfo.lastUpdate', 'Last Update')}:</span>
                  <span className="font-medium">{t('sidebar.quickInfo.today', 'Today')}</span>
                </div>
              </div>
            </div>

            {/* Translation Test */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('sidebar.translationTest.title', 'Translation Test')}
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>{t('sidebar.translationTest.greeting', 'Greeting')}:</strong>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    {t('greetings.hello', 'Hello!')}
                  </div>
                </div>
                <div>
                  <strong>{t('sidebar.translationTest.farewell', 'Farewell')}:</strong>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    {t('greetings.goodbye', 'Goodbye!')}
                  </div>
                </div>
                <div>
                  <strong>{t('sidebar.translationTest.thankYou', 'Thank You')}:</strong>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    {t('greetings.thanks', 'Thank you!')}
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('sidebar.support.title', 'Need Help?')}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {t('sidebar.support.description', 'Our support team is here to help you 24/7.')}
              </p>
              <div className="space-y-2">
                <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  {t('sidebar.support.chat', 'Start Live Chat')}
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  {t('sidebar.support.documentation', 'View Documentation')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">
                {t('footer.company.title', 'Company')}
              </h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.company.about', 'About Us')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.company.careers', 'Careers')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.company.news', 'News')}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">
                {t('footer.products.title', 'Products')}
              </h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.products.translation', 'Translation Services')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.products.localization', 'Localization')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.products.api', 'API Access')}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">
                {t('footer.support.title', 'Support')}
              </h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.support.help', 'Help Center')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.support.contact', 'Contact Us')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.support.status', 'System Status')}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">
                {t('footer.legal.title', 'Legal')}
              </h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.legal.privacy', 'Privacy Policy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.legal.terms', 'Terms of Service')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.legal.cookies', 'Cookie Policy')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              {t('footer.copyright', '© 2024 Multilingual Demo App. All rights reserved.')} | 
              {t('footer.poweredBy', 'Powered by Locize')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Translate;