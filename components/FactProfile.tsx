import React, { useState } from 'react';
import { MOCK_FACTS } from '../services/mockStore';
import { BusinessFacts } from '../types';

const FactProfile: React.FC = () => {
  const [facts, setFacts] = useState<BusinessFacts>(MOCK_FACTS);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // In a real app, API call here
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addArrayItem = (key: keyof BusinessFacts, value: string) => {
    if(!value) return;
    setFacts(prev => ({
        ...prev,
        [key]: [...(prev[key] as string[]), value]
    }));
  };

  const removeArrayItem = (key: keyof BusinessFacts, index: number) => {
    setFacts(prev => ({
        ...prev,
        [key]: (prev[key] as string[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <header>
          <h1 className="text-2xl font-bold text-gray-900">Факты о бизнесе и безопасность</h1>
          <p className="text-gray-500">Этот контекст используется ИИ для генерации достоверных гипотез.</p>
       </header>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Geography & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">География обслуживания</label>
                    <input 
                        type="text" 
                        value={facts.geography}
                        onChange={(e) => setFacts({...facts, geography: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Часы работы</label>
                    <input 
                        type="text" 
                        value={facts.hours}
                        onChange={(e) => setFacts({...facts, hours: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* List Managers */}
            <div className="space-y-6">
                <ListManager 
                    title="Услуги / Продукты" 
                    items={facts.services} 
                    onAdd={(v) => addArrayItem('services', v)}
                    onRemove={(i) => removeArrayItem('services', i)}
                />
                 <ListManager 
                    title="Реальные преимущества (Факты)" 
                    items={facts.advantages} 
                    onAdd={(v) => addArrayItem('advantages', v)}
                    onRemove={(i) => removeArrayItem('advantages', i)}
                />
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Безопасность и соответствие (Compliance)
                </h3>
                
                <div className="space-y-4">
                     <ListManager 
                        title="Запрещенные фразы (Риски/Юр.)" 
                        items={facts.forbiddenPhrases} 
                        onAdd={(v) => addArrayItem('forbiddenPhrases', v)}
                        onRemove={(i) => removeArrayItem('forbiddenPhrases', i)}
                    />
                    
                    <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="forbidNumbers"
                            checked={facts.forbidNumbers}
                            onChange={(e) => setFacts({...facts, forbidNumbers: e.target.checked})}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="forbidNumbers" className="text-sm text-gray-700">
                            <strong>Строгая политика цифр:</strong> ИИ не может придумывать цены, сроки или количества, если они не указаны в фактах явно.
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${isSaved ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isSaved ? 'Сохранено!' : 'Сохранить факты'}
                </button>
            </div>
       </div>
    </div>
  );
};

const ListManager = ({ title, items, onAdd, onRemove }: { title: string, items: string[], onAdd: (val: string) => void, onRemove: (idx: number) => void }) => {
    const [val, setVal] = useState("");
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
            <div className="flex space-x-2 mb-3">
                <input 
                    type="text" 
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { onAdd(val); setVal(""); }}}
                    className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm text-sm"
                    placeholder="Добавить пункт..."
                />
                <button 
                    onClick={() => { onAdd(val); setVal(""); }}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm font-medium"
                >
                    Добавить
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item}
                        <button onClick={() => onRemove(idx)} className="ml-1.5 text-indigo-600 hover:text-indigo-900 focus:outline-none">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FactProfile;