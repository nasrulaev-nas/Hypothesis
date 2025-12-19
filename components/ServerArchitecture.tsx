
import React, { useState, useEffect } from 'react';
import { allocateVariant } from '../utils/trafficAllocator';

const CODE_CLIENT_SDK = `/**
 * client.js - Этот файл загружается на сайт клиента.
 * Вес: < 3KB (gzipped). Без зависимостей.
 */
(function() {
  const PROJECT_ID = document.currentScript.getAttribute('data-project-id');
  
  // 1. Идентификация пользователя (Cookie)
  let userId = getCookie('hyp_uid');
  if (!userId) {
    userId = 'u_' + Math.random().toString(36).substr(2, 9);
    // Cookie на 1 год
    document.cookie = \`hyp_uid=\${userId}; path=/; max-age=31536000; SameSite=Lax\`;
  }

  // 2. Получение конфигурации экспериментов для текущего URL
  // Запрос асинхронный, не блокирует загрузку сайта
  const apiUrl = \`https://api.hypothesis-ai.com/v1/config?pid=\${PROJECT_ID}&url=\${encodeURIComponent(location.href)}&uid=\${userId}\`;
  
  fetch(apiUrl)
    .then(res => res.json())
    .then(applyExperiments)
    .catch(err => console.error('HypothesisAI: Config error', err));

  function applyExperiments(config) {
    if (!config || !config.experiments) return;

    config.experiments.forEach(exp => {
       // 3. Поиск элемента в DOM
       const el = document.querySelector(exp.selector);
       if (!el) return;

       // Если это не контрольный вариант (не оригинал) - меняем текст
       if (exp.variantId !== 'control') {
          // Защита от мерцания: можно добавить opacity транзишн
          el.textContent = exp.content; 
       }

       // 4. Отправка события показа (Exposure)
       // Используем Beacon API чтобы не замедлять закрытие страницы
       navigator.sendBeacon('https://api.hypothesis-ai.com/v1/events', JSON.stringify({
          type: 'exposure',
          projectId: PROJECT_ID,
          experimentId: exp.id,
          variantId: exp.variantId,
          userId: userId,
          timestamp: Date.now()
       }));
    });
  }

  // Вспомогательная функция для Cookie
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
})();`;

const CODE_NODE_JS = `// GET /api/v1/config?url=...&userId=...
import { allocateVariant } from './utils/trafficAllocator';

app.get('/api/v1/config', async (req, res) => {
  const { url, userId, pid } = req.query;
  
  // 1. Получаем кешированный конфиг проекта
  const projectConfig = await getProjectConfig(pid); // Redis/Memory
  if (!projectConfig) return res.status(404).json({});

  // 2. Фильтруем активные эксперименты для этого URL
  const matches = projectConfig.experiments.filter(exp => 
      exp.status === 'RUNNING' && new RegExp(exp.urlPattern).test(url)
  );

  const responsePayload = { experiments: [] };

  matches.forEach(exp => {
      // 3. Стабильное распределение (Hashing)
      // Сервер решает, какой вариант показать этому UserID
      const allocation = allocateVariant(userId, exp.id, exp.variants);
      const variant = exp.variants.find(v => v.id === allocation.variantId);

      responsePayload.experiments.push({
          id: exp.id,
          selector: exp.selector,
          variantId: variant.id,
          content: variant.content
      });
  });

  // CORS заголовки обязательны, т.к. запрос с чужого домена
  res.set('Access-Control-Allow-Origin', '*');
  res.json(responsePayload);
});`;

const ServerArchitecture: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'infra' | 'client' | 'node' | 'playground'>('infra');
    
    // Playground State
    const [userId, setUserId] = useState<string>('user_12345');
    const [expId, setExpId] = useState<string>('exp_abc99');
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const variants = [
            { id: 'v_control', isControl: true, trafficSplit: 50 },
            { id: 'v_challenger', isControl: false, trafficSplit: 50 }
        ];
        setResult(allocateVariant(userId, expId, variants));
    }, [userId, expId]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Архитектура: Client-Side JS</h1>
                <p className="text-gray-500">Реализация через JS-сниппет. SEO-Edge режим отключен для упрощения MVP.</p>
            </header>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('infra')}
                        className={`${activeTab === 'infra' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Хостинг и Инфраструктура
                    </button>
                    <button 
                        onClick={() => setActiveTab('client')}
                        className={`${activeTab === 'client' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Client SDK (Браузер)
                    </button>
                    <button 
                        onClick={() => setActiveTab('node')}
                        className={`${activeTab === 'node' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Backend API
                    </button>
                     <button 
                        onClick={() => setActiveTab('playground')}
                        className={`${activeTab === 'playground' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Тест сплита
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'infra' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Что нужно для запуска</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Для режима Client-Side требования к серверам минимальны, так как тяжелая работа (рендеринг HTML) происходит в браузере пользователя, а не на вашем сервере.
                                </p>
                                
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs mt-0.5">1</div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Backend API (Node.js)</p>
                                            <p className="text-sm text-gray-500">
                                                Небольшой сервис на Express/Fastify. Он принимает запросы <code>/config</code> (отдает JSON) и <code>/events</code> (принимает статистику).
                                            </p>
                                            <p className="text-xs text-indigo-600 mt-1 font-medium">Подойдет: DigitalOcean Droplet ($6/mo) или любой VPS.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs mt-0.5">2</div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">База данных</p>
                                            <p className="text-sm text-gray-500">PostgreSQL (хранит проекты, варианты, статистику).</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs mt-0.5">3</div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">CDN для скрипта (Опционально)</p>
                                            <p className="text-sm text-gray-500">Файл <code>client.js</code> статический. Его лучше раздавать через CDN (Cloudflare, AWS CloudFront), чтобы он грузился мгновенно в любой точке мира.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                                <h4 className="font-bold text-amber-900 mb-2">Ограничения Client-Side подхода</h4>
                                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                                    <li>Возможен эффект "мерцания" (Flicker), когда пользователь на долю секунды видит старый текст перед заменой.</li>
                                    <li>Решение: Использовать <code>&lt;style&gt;.opacity-0&lt;/style&gt;</code> для тестируемых элементов или быстрый API.</li>
                                    <li>Не влияет напрямую на SEO (Google индексирует JS, но медленнее). Для чистого SEO нужен Edge режим.</li>
                                </ul>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-medium text-gray-900 mb-3">Примерная нагрузка</h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    Если у клиента <strong>100,000 визитов</strong> в месяц:
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-xl font-bold text-gray-800">~2 RPS</div>
                                        <div className="text-xs text-gray-500">Запросов в секунду</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-xl font-bold text-gray-800">~50 ms</div>
                                        <div className="text-xs text-gray-500">Целевая задержка</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'client' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                             <p className="text-gray-600">
                                Это код, который исполняется в браузере посетителя. Он максимально легкий и безопасный.
                            </p>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Pure JS (No React/Vue)</span>
                        </div>
                       
                        <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto relative">
                             <div className="absolute top-4 right-4 text-xs text-slate-500">client.js</div>
                            <pre className="text-sm font-mono text-blue-300 leading-relaxed">{CODE_CLIENT_SDK}</pre>
                        </div>
                    </div>
                )}

                {activeTab === 'node' && (
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Серверная часть (API), которая решает, какой вариант показать пользователю.
                        </p>
                        <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                            <pre className="text-sm font-mono text-green-400 leading-relaxed">{CODE_NODE_JS}</pre>
                        </div>
                    </div>
                )}

                {activeTab === 'playground' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Тест алгоритма (Server-side decision)</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Даже в клиентском режиме мы рекомендуем принимать решение о сплите на сервере (в API), чтобы логика была скрыта от конкурентов и защищена от накруток.
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">User ID (из cookie hyp_uid)</label>
                                        <input 
                                            type="text" 
                                            value={userId} 
                                            onChange={e => setUserId(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Experiment ID</label>
                                        <input 
                                            type="text" 
                                            value={expId} 
                                            onChange={e => setExpId(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                            <h4 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Результат аллокации</h4>
                            <div className="text-6xl font-bold text-white mb-2">
                                {result?.hashValue} <span className="text-2xl text-slate-500">/ 100</span>
                            </div>
                            <div className={`text-2xl font-bold px-4 py-2 rounded-full ${result?.isControl ? 'bg-gray-700 text-gray-300' : 'bg-indigo-600 text-white'}`}>
                                {result?.isControl ? 'Вариант А (Control)' : 'Вариант Б (AI)'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServerArchitecture;
