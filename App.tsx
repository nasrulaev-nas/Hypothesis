
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FactProfile from './components/FactProfile';
import ExperimentWizard from './components/ExperimentWizard';
import ExperimentDetail from './components/ExperimentDetail';
import ServerArchitecture from './components/ServerArchitecture';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

import { MOCK_EXPERIMENTS } from './services/mockStore';
import { Link } from 'react-router-dom';

const getStatusLabel = (status: string) => {
    switch(status) {
        case 'RUNNING': return 'Активен';
        case 'COMPLETED': return 'Завершен';
        case 'PAUSED': return 'На паузе';
        case 'DRAFT': return 'Черновик';
        case 'ARCHIVED': return 'В архиве';
        default: return status;
    }
}

const ExperimentList = () => (
    <div className="space-y-6">
        <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Эксперименты</h1>
            <Link to="/experiments/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Новый эксперимент</Link>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Метрика</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата начала</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Просмотр</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {MOCK_EXPERIMENTS.map(exp => (
                        <tr key={exp.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{exp.name}</div>
                                <div className="text-sm text-gray-500">{exp.urlPattern}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exp.status === 'RUNNING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {getStatusLabel(exp.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Посетители: {exp.stats.visitors.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exp.startDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/experiments/${exp.id}`} className="text-indigo-600 hover:text-indigo-900">Открыть</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
    </div>
);

const InstallPage = () => (
    <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Установка</h1>
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <p className="mb-4 text-gray-600">Скопируйте этот фрагмент кода и вставьте его в секцию <code>&lt;head&gt;</code> вашего сайта.</p>
            <div className="bg-slate-900 rounded-lg p-4 relative group">
                <code className="text-green-400 text-sm font-mono break-all">
                    &lt;script async src="https://cdn.hypothesis-ai.com/js/v1/client.js" data-project-id="p-1"&gt;&lt;/script&gt;
                </code>
            </div>
            <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Статус проверки</h3>
                <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Скрипт обнаружен на acme-saas.ru</span>
                </div>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
            {/* Public Routes (No Sidebar) */}
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Application Routes (With Sidebar) */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/facts" element={<Layout><FactProfile /></Layout>} />
            <Route path="/experiments" element={<Layout><ExperimentList /></Layout>} />
            <Route path="/experiments/new" element={<Layout><ExperimentWizard /></Layout>} />
            <Route path="/experiments/:id" element={<Layout><ExperimentDetail /></Layout>} />
            <Route path="/install" element={<Layout><InstallPage /></Layout>} />
            <Route path="/architecture" element={<Layout><ServerArchitecture /></Layout>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  );
};

export default App;
