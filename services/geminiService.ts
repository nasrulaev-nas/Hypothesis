import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessFacts, ElementType } from "../types";

// Initialize Gemini Client
// Note: API key is assumed to be in process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

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
  
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning mock data for demonstration.");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                hypotheses: [
                    { text: "Оптимизировано: " + originalText, reasoning: "Мок-генерация: отсутствует API ключ." },
                    { text: "Акцент на выгоде: " + originalText, reasoning: "Фокус на пользе для пользователя." },
                    { text: "Кратко и емко: " + originalText.substring(0, 10) + "...", reasoning: "Краткость повышает конверсию." }
                ]
            })
        }, 1500);
    });
  }

  const systemInstruction = `
    Вы эксперт по оптимизации конверсии (CRO) и копирайтингу. 
    Ваша цель — генерировать гипотезы для A/B тестирования текстов на сайте на РУССКОМ языке.
    
    Строгие правила:
    1. НЕ выдумывайте факты. Используйте только предоставленные "Факты о бизнесе".
    2. Если "forbidNumbers" (запрет чисел) = true, не придумывайте цены, время или количество, если их нет в фактах.
    3. Избегайте "forbiddenPhrases" (запрещенных фраз), указанных в фактах.
    4. Сохраняйте тональность, подходящую для бизнеса.
    5. Ответ должен быть валидным JSON.
    6. Все тексты гипотез и обоснования должны быть на русском языке.
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
    - Строгость к цифрам: ${facts.forbidNumbers ? 'ДА (Только подтвержденные)' : 'НЕТ'}

    Сгенерируй 3 отличных варианта текста для A/B теста против оригинала.
    Для каждого варианта напиши краткое обоснование (reasoning), почему это может повысить конверсию.
  `;

  const schema: Schema = {
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
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7, // Creativity balance
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(text) as HypothesisResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate hypotheses. Please try again.");
  }
};

export const validateFactCompliance = async (
    text: string,
    facts: BusinessFacts
): Promise<{ valid: boolean; issues: string[] }> => {
     if (!process.env.API_KEY) return { valid: true, issues: [] };

     const prompt = `
        Задача: Проверь, соответствует ли текст "${text}" бизнес-ограничениям. Отвечай на русском.
        
        Ограничения:
        - География: ${facts.geography}
        - Услуги: ${facts.services.join(', ')}
        - Запрещенные фразы: ${facts.forbiddenPhrases.join(', ')}
        - Политика цифр: ${facts.forbidNumbers ? "Запрещены непроверенные цифры" : "Свободная"}

        Верни JSON: { "valid": boolean, "issues": string[] }
     `;

     const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            valid: { type: Type.BOOLEAN },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
     };

     try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return JSON.parse(response.text || '{"valid":false, "issues":["API Error"]}') as { valid: boolean, issues: string[] };
     } catch (e) {
         return { valid: false, issues: ["Validation service unavailable"] };
     }
}