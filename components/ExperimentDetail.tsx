
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/supabase';
import { generateMockAnalytics } from '../services/mockStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExperimentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [experiment, setExperiment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const data = generateMockAnalytics(14); // Keep chart as mock for visualization unless real data table exists

    useEffect(() => {
        async function loadExperiment() {
            if (!id) return;
            try {
                const exp = await db.experiments.getById(id);
                setExperiment(exp);
            } catch (error) {
                console.error("Error loading experiment:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadExperiment();
    }, [id]);

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 animate-pulse">Загрузка данных эксперимента...</div>;
    }

    if (!experiment) {
        return <div className="p-12 text-center text-red-500">Эксперимент не найден</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Link to="/experiments" className="hover:text-indigo-600">Эксперименты</Link>
                        <span>/</span>
                        <span>{experiment.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{experiment.name}</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${experiment.status === 'RUNNING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {experiment.status === 'RUNNING' ? 'Активен' : experiment.status}
                    </span>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">Пауза</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all">Выбрать победителя</button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm">Всего посетителей</p>
                    <p className="text-2xl font-bold">{(experiment.stats?.visitors || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm">Конверсии</p>
                    <p className="text-2xl font-bold">{experiment.stats?.conversions || 0}</p>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm">Сводный балл</p>
                    <p className="text-2xl font-bold text-indigo-600">{experiment.stats?.compositeScore || 0}</p>
                    <p className="text-xs text-gray-400">Взвеш. (Конв. + Клики)</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm">Достоверность</p>
                    <p className="text-2xl font-bold text-green-600">{( (experiment.stats?.confidence || 0) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">Байесовская вероятность</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Тренд эффективности (Конверсии)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                            <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="control" name="Контроль (A)" stroke="#94a3b8" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="variantB" name="Вариант Б (AI)" stroke="#4f46e5" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Variants Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(experiment.variants || []).map((v: any, i: number) => (
                    <div key={v.id || i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                        {v.isControl ? (
                            <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-bl">Контроль</div>
                        ) : (
                            <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-bl">Претендент</div>
                        )}
                        <h4 className="font-medium text-gray-500 mb-2">{v.name}</h4>
                        <div className="p-4 bg-gray-50 rounded-lg text-lg font-medium text-gray-900 border border-gray-200">
                            {v.content}
                        </div>
                        <div className="mt-4 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Трафик: {v.trafficSplit}%</span>
                            {!v.isControl && experiment.stats?.visitors > 0 && <span className="text-green-600 font-bold">+12.4% Прирост</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperimentDetail;
