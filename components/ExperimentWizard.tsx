import React, { useState } from 'react';
import { ElementType } from '../types';
import { generateHypotheses } from '../services/geminiService';
import { MOCK_FACTS } from '../services/mockStore';

// Simulated website content for the Visual Editor
const VISUAL_MOCK_HTML = (
    <div className="font-sans antialiased bg-white text-gray-900 h-full p-8 border-4 border-dashed border-gray-200 rounded-lg select-none relative">
        <div className="absolute top-0 left-0 bg-gray-100 text-gray-400 text-xs px-2 py-1 rounded-br">Предпросмотр сайта</div>
        
        {/* Header */}
        <nav className="flex justify-between items-center mb-12">
            <div className="font-bold text-xl text-indigo-600">AcmeSaaS</div>
            <div className="space-x-6 text-sm font-medium text-gray-500">
                <span className="cursor-pointer hover:text-gray-900" data-selector="nav.link-1">Возможности</span>
                <span className="cursor-pointer hover:text-gray-900" data-selector="nav.link-2">Цены</span>
                <span className="cursor-pointer hover:text-gray-900" data-selector="nav.link-3">Войти</span>
            </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 
                className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 hover:ring-2 ring-indigo-500 ring-offset-4 cursor-pointer rounded transition-all"
                data-selector="h1.hero-title"
                data-type={ElementType.HEADLINE}
            >
                Лучший SEO инструмент для малого бизнеса
            </h1>
            <p 
                className="text-xl text-gray-500 mb-8 hover:ring-2 ring-indigo-500 ring-offset-4 cursor-pointer rounded transition-all"
                data-selector="p.hero-sub"
                data-type={ElementType.PARAGRAPH}
            >
                Хватит гадать. Начните ранжироваться. Наша платформа на базе ИИ поможет найти ключевые слова, которые действительно продают, без корпоративных ценников.
            </p>
            <div className="flex justify-center space-x-4">
                <button 
                    className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 hover:ring-2 ring-indigo-500 ring-offset-4 transition-all"
                    data-selector="button.cta-primary"
                    data-type={ElementType.BUTTON}
                >
                    Попробовать бесплатно
                </button>
                <button 
                    className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:ring-2 ring-indigo-500 ring-offset-4 transition-all"
                    data-selector="button.cta-secondary"
                    data-type={ElementType.BUTTON}
                >
                    Демо-видео
                </button>
            </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg hover:ring-2 ring-indigo-500 cursor-pointer" data-selector={`div.feature-${i}`}>
                    <div className="h-10 w-10 bg-indigo-100 rounded-full mx-auto mb-4"></div>
                    <h3 className="font-semibold mb-2">Преимущество {i}</h3>
                    <p className="text-sm text-gray-500">Подробное описание преимущества номер {i} находится здесь.</p>
                </div>
            ))}
        </div>
    </div>
);

const ExperimentWizard: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedElement, setSelectedElement] = useState<{selector: string, text: string, type: ElementType} | null>(null);
    const [hypotheses, setHypotheses] = useState<Array<{text: string, reasoning: string}>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null);

    // Step 1: Visual Selector
    const handleElementClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const selector = target.getAttribute('data-selector');
        const type = target.getAttribute('data-type') as ElementType;
        
        if (selector) {
            setSelectedElement({
                selector,
                text: target.innerText,
                type: type || ElementType.PARAGRAPH
            });
        }
    };

    // Step 2: AI Generation
    const handleGenerate = async () => {
        if (!selectedElement) return;
        setIsLoading(true);
        setStep(2);
        
        try {
            const result = await generateHypotheses(
                selectedElement.text,
                selectedElement.type,
                MOCK_FACTS
            );
            setHypotheses(result.hypotheses);
        } catch (error) {
            console.error(error);
            alert("Не удалось сгенерировать гипотезы. Проверьте консоль.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Confirmation (Mock)
    const handleLaunch = () => {
        setStep(3);
        // Here we would post to API
    };

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Эксперимент запущен!</h2>
                <p className="text-gray-500 max-w-md mb-6">
                    "Оптимизация {selectedElement?.type}" теперь активна. Мы собираем данные и сообщим вам, когда будет достигнута статистическая значимость.
                </p>
                <a href="#/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Вернуться в обзор</a>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Новый эксперимент</h1>
                    <p className="text-gray-500">Шаг {step}: {step === 1 ? 'Выберите элемент' : 'Выберите вариант'}</p>
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Panel: Preview / Editor */}
                <div 
                    className={`flex-1 overflow-auto transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                    onClick={step === 1 ? handleElementClick : undefined}
                >
                    {VISUAL_MOCK_HTML}
                </div>

                {/* Right Panel: Controls */}
                <div className="w-96 flex flex-col space-y-4">
                    
                    {/* Selection Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Выбранный элемент</h3>
                        {selectedElement ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                    <span className="text-xs text-gray-400 block mb-1">Текущий текст</span>
                                    <p className="font-medium text-gray-900 text-sm line-clamp-3">"{selectedElement.text}"</p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <code>{selectedElement.selector}</code>
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{selectedElement.type}</span>
                                </div>
                                {step === 1 && (
                                    <button 
                                        onClick={handleGenerate}
                                        className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2 rounded-lg font-medium shadow hover:shadow-lg transition-all flex justify-center items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Сгенерировать гипотезы
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm italic">
                                Кликните по элементу на предпросмотре слева.
                            </div>
                        )}
                    </div>

                    {/* AI Suggestions */}
                    {step === 2 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Гипотезы ИИ</h3>
                            {isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded"></div>)}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {hypotheses.map((hyp, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setSelectedHypothesis(idx)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedHypothesis === idx ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <p className="font-semibold text-gray-900 mb-2">{hyp.text}</p>
                                            <p className="text-xs text-gray-500 italic">Почему: {hyp.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <button 
                                disabled={selectedHypothesis === null}
                                onClick={handleLaunch}
                                className="w-full mt-6 bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
                            >
                                Запустить эксперимент
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperimentWizard;