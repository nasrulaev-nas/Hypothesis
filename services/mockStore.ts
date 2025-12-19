import { BusinessFacts, Experiment, ExperimentStatus, Project, ElementType } from "../types";

export const MOCK_PROJECT: Project = {
  id: 'p-1',
  name: 'Acme SaaS Лендинг',
  domain: 'acme-saas.ru',
  status: 'active',
  monthlyTraffic: 8500,
  planLimit: 10000
};

export const MOCK_FACTS: BusinessFacts = {
  geography: "Россия, СНГ",
  hours: "Поддержка 24/7",
  services: ["Автоматизация SEO", "ИИ копирайтинг", "Трекинг позиций"],
  advantages: ["Дешевле конкурентов", "Без привязки карты для триала", "Интеграция с WordPress"],
  forbiddenPhrases: ["Гарантия топ-1", "Бесплатно навсегда"],
  forbidNumbers: true
};

export const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-101',
    projectId: 'p-1',
    name: 'Оптимизация заголовка Hero',
    urlPattern: '/',
    selector: 'h1.hero-title',
    elementType: ElementType.HEADLINE,
    originalText: "Лучший SEO инструмент для малого бизнеса",
    status: ExperimentStatus.RUNNING,
    startDate: '2023-10-15',
    variants: [
      { id: 'v-a', name: 'Контроль (А)', content: "Лучший SEO инструмент для малого бизнеса", isControl: true, trafficSplit: 50 },
      { id: 'v-b', name: 'Вариант Б', content: "Автоматизируйте SEO и растите быстрее", isControl: false, trafficSplit: 50 }
    ],
    stats: {
      visitors: 4500,
      conversions: 210,
      compositeScore: 4.8,
      confidence: 0.92
    }
  },
  {
    id: 'exp-102',
    projectId: 'p-1',
    name: 'Цвет и текст CTA кнопки',
    urlPattern: '/',
    selector: 'button.signup-btn',
    elementType: ElementType.BUTTON,
    originalText: "Попробовать бесплатно",
    status: ExperimentStatus.COMPLETED,
    startDate: '2023-09-01',
    variants: [
      { id: 'v-a', name: 'Контроль (А)', content: "Попробовать бесплатно", isControl: true, trafficSplit: 0 },
      { id: 'v-b', name: 'Вариант Б', content: "Начать без карты", isControl: false, trafficSplit: 100 }
    ],
    stats: {
      visitors: 12000,
      conversions: 800,
      compositeScore: 6.7,
      confidence: 0.99
    }
  }
];

export const generateMockAnalytics = (days: number) => {
    const data = [];
    let baseA = 100;
    let baseB = 105;
    for (let i = 0; i < days; i++) {
        baseA += Math.random() * 20 - 5;
        baseB += Math.random() * 25 - 5;
        data.push({
            date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('ru-RU', {month:'short', day:'numeric'}),
            control: Math.floor(baseA),
            variantB: Math.floor(baseB)
        });
    }
    return data;
};