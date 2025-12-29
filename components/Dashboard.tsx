
import React, { useEffect, useState } from 'react';
import { db } from '../services/supabase';
import { Link } from 'react-router-dom';
import { Activity, Users, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, sub, color, icon: Icon }: { title: string; value: string; sub: string; color: string; icon: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
         <Icon size={24} />
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">{sub}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError(null);
        const data = await db.experiments.getAll();
        setExperiments(data || []);
      } catch (e: any) {
        console.error("Ошибка загрузки данных из БД:", e);
        let errorMessage = "Не удалось загрузить данные. Проверьте подключение к Supabase.";
        if (e instanceof Error) {
          errorMessage = e.message;
        } else if (typeof e === 'string') {
          errorMessage = e;
        } else if (e && typeof e === 'object' && e.message) {
          errorMessage = String(e.message);
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const activeCount = experiments.filter(e => e.status === 'RUNNING').length;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Обзор системы</h1>
          <p className="text-gray-500 mt-1">
            Мониторинг эффективности в реальном времени
          </p>
        </div>
        <Link 
          to="/experiments/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>+</span> Создать эксперимент
        </Link>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-center space-x-3 text-red-700">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Активные тесты" 
            value={activeCount.toString()} 
            sub="Влияют на трафик сейчас" 
            color="bg-blue-500" 
            icon={Activity}
        />
        <StatCard 
            title="Всего визитов" 
            value="12.4k" 
            sub="За последние 30 дней" 
            color="bg-green-500" 
            icon={Users}
        />
        <StatCard 
            title="Эффективность ИИ" 
            value="+14.2%" 
            sub="Средний рост конверсии" 
            color="bg-violet-500" 
            icon={TrendingUp}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-gray-800">Последние эксперименты</h2>
            <Link to="/experiments" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Смотреть все</Link>
        </div>
        <div className="divide-y divide-gray-100">
            {experiments.length === 0 ? (
                <div className="p-12 text-center text-gray-400">Нет активных экспериментов</div>
            ) : experiments.slice(0, 5).map(exp => (
                <div key={exp.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <Link to={`/experiments/${exp.id}`} className="block">
                        <div className="flex justify-between items-center">
                            <div className="flex items-start space-x-4">
                                <div className={`mt-1 w-2.5 h-2.5 rounded-full ${exp.status === 'RUNNING' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{exp.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{exp.element_type || exp.elementType} • {exp.url_pattern || exp.urlPattern}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{exp.status}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '—'}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
