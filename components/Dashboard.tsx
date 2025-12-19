import React from 'react';
import { MOCK_PROJECT, MOCK_EXPERIMENTS } from '../services/mockStore';
import { ExperimentStatus } from '../types';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, sub, color }: { title: string; value: string; sub: string; color: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
         <div className={`w-6 h-6 ${color.replace('bg-', 'text-')}`}></div>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">{sub}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const activeExperiments = MOCK_EXPERIMENTS.filter(e => e.status === ExperimentStatus.RUNNING).length;
  const trafficUsage = Math.round((MOCK_PROJECT.monthlyTraffic / MOCK_PROJECT.planLimit) * 100);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Обзор</h1>
          <p className="text-gray-500 mt-1">Сводка для {MOCK_PROJECT.domain}</p>
        </div>
        <Link 
          to="/experiments/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Новый эксперимент
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Активные эксперименты" 
            value={activeExperiments.toString()} 
            sub="3 слота доступно" 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Посетители в месяц" 
            value={MOCK_PROJECT.monthlyTraffic.toLocaleString()} 
            sub={`${trafficUsage}% от лимита ${MOCK_PROJECT.planLimit.toLocaleString()}`} 
            color="bg-green-500" 
        />
        <StatCard 
            title="Ср. рост конверсии" 
            value="+12.5%" 
            sub="По всем завершенным тестам" 
            color="bg-violet-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Недавняя активность</h2>
            <Link to="/experiments" className="text-sm text-indigo-600 hover:text-indigo-800">Все эксперименты</Link>
        </div>
        <div className="divide-y divide-gray-100">
            {MOCK_EXPERIMENTS.map(exp => (
                <div key={exp.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${exp.status === 'RUNNING' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                <h3 className="text-sm font-semibold text-gray-900">{exp.name}</h3>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-4">{exp.elementType} на {exp.urlPattern}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{exp.stats.visitors.toLocaleString()} польз.</div>
                            <div className="text-xs text-gray-500">{exp.stats.conversions} конверсий</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;