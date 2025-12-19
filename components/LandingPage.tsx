
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <span className="font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Hypothesis AI</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Войти</Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
            Начать бесплатно
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6">
          Теперь с поддержкой GPT-4 и Gemini 2.5
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
          A/B тестирование текстов <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">на автопилоте</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
          Повышайте конверсию сайта без разработчиков. Наш ИИ генерирует гипотезы, запускает тесты и выбирает победителей.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
            Запустить тест за 2 минуты
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
            Демонстрация
          </Link>
        </div>
        <div className="mt-12 p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
            <code className="text-gray-500 font-mono text-sm">
                &lt;script src="https://cdn.hypothesis-ai.com/js/client.js"&gt;&lt;/script&gt;
            </code>
            <p className="text-xs text-gray-400 mt-2">Единственная строчка кода, которая вам нужна</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">Почему Hypothesis AI?</h2>
                <p className="mt-4 text-gray-500">Мы объединили мощь LLM моделей с классической математической статистикой.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    title="Генерация гипотез"
                    desc="Вам не нужно быть копирайтером. ИИ анализирует ваш сайт и предлагает варианты заголовков, которые бьют в боли клиентов."
                />
                <FeatureCard 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="Контроль правдивости"
                    desc="Загрузите факты о бизнесе, и ИИ никогда не придумает несуществующие скидки или ложные сроки доставки."
                />
                <FeatureCard 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    title="Умная статистика"
                    desc="Не просто 'клики'. Мы считаем композитные метрики (скролл + время + цель), чтобы найти реально вовлеченных пользователей."
                />
            </div>
        </div>
      </section>

      {/* Architecture / SEO Info */}
      <section className="py-24 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Безопасно для SEO</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Многие A/B тесты вредят позициям в поиске из-за CLS (сдвига макета) или клоакинга. 
                    Hypothesis AI работает иначе.
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Загрузка скрипта &lt; 50мс (Edge CDN)</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Отсутствие мерцания (Anti-flicker snippet)</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Client-side для UI и Server-side для мета-тегов</span>
                    </li>
                </ul>
            </div>
            <div className="flex-1 bg-slate-900 rounded-2xl p-8 shadow-2xl text-white">
                <div className="font-mono text-sm space-y-2">
                    <div className="text-green-400">// Client SDK Logic</div>
                    <div>const allocation = allocateVariant(userId, expId);</div>
                    <div>if (allocation.isVariantB) {'{'}</div>
                    <div className="pl-4 text-yellow-300">element.textContent = "Новый заголовок";</div>
                    <div className="pl-4 text-blue-300">trackExposure(expId, 'B');</div>
                    <div>{'}'}</div>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Hypothesis AI. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default LandingPage;
