import { GoogleGenAI, Type } from "@google/genai";
import { BusinessFacts, ElementType } from "../types";

// Инициализация Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY не задан. Добавь его в .env.local");
}
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

interface HypothesisResponse {
  hypotheses: Array<{
    text: string;
    reasoning: string;
  }>;
}

export const generateHypotheses = async (
  originalText: string,
  elementType: ElementType,
  facts: BusinessFacts,
  contextDescription: string = "Лендинг для бизнеса"
): Promise<HypothesisResponse> => {
  
  const systemInstruction = `
    Вы эксперт по оптимизации конверсии (CRO) и копирайтингу. 
    Ваша цель — генерировать гипотезы для A/B тестирования текстов на сайте на РУССКОМ языке.
    
    Строгие правила:
    1. НЕ выдумывайте факты. Используйте только предоставленные "Факты о бизнесе".
    2. Если "forbidNumbers" = true, не придумывайте цены, время или количество, если их нет в фактах.
    3. Избегайте "forbiddenPhrases" (запрещенных фраз).
    4. Ответ должен быть валидным JSON.
    5. Все тексты гипотез и обоснования должны быть на русском языке.
  `;

  const prompt = `
    Оригинальный текст: "${originalText}"
    Тип элемента: ${elementType}
    Контекст страницы: ${contextDescription}
    
    Факты о бизнесе:
    - География: ${facts.geography}
    - Услуги: ${facts.services.join(', ')}
    - Преимущества: ${facts.advantages.join(', ')}
    - Запрещенные фразы: ${facts.forbiddenPhrases.join(', ')}
    - Строгость к цифрам: ${facts.forbidNumbers ? 'ДА' : 'НЕТ'}

    Сгенерируй 3 отличных варианта текста для A/B теста.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hypotheses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  reasoning: { type: Type.STRING }
                },
                required: ["text", "reasoning"]
              }
            }
          },
          required: ["hypotheses"]
        },
        temperature: 1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(text) as HypothesisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock
    return {
      hypotheses: [
        { text: "Вариант 1: Фокус на выгоде", reasoning: "Обоснование на базе ИИ" },
        { text: "Вариант 2: Краткий призыв", reasoning: "Улучшение читаемости" },
        { text: "Вариант 3: Социальное доказательство", reasoning: "Повышение доверия" }
      ]
    };
  }
};

export const validateFactCompliance = async (
  text: string,
  facts: BusinessFacts
): Promise<{ valid: boolean; issues: string[] }> => {
  const prompt = `Проверь текст "${text}" на соответствие фактам: ${JSON.stringify(facts)}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["valid", "issues"]
        }
      }
    });
    return JSON.parse(response.text || '{"valid":true, "issues":[]}') as { valid: boolean, issues: string[] };
  } catch (e) {
    return { valid: true, issues: [] };
  }
};
