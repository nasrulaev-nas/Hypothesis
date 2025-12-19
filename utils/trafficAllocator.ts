
/**
 * Реализация детерминированного распределения трафика (Server-side Logic).
 * Используется алгоритм FNV-1a для преобразования строки (UserID + ExpID) в число.
 * Это гарантирует, что пользователь всегда попадет в одну и ту же выборку без хранения состояния.
 */

export const fnv1aHash = (str: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
};

export interface AllocationResult {
  variantId: string;
  isControl: boolean;
  hashValue: number; // Для отладки (0-100)
}

export const allocateVariant = (
  userId: string,
  experimentId: string,
  variants: Array<{ id: string; isControl: boolean; trafficSplit: number }> // trafficSplit в сумме 100? Или вероятность попадания в B?
  // В упрощенной модели 50/50: если hash < 50 -> A, иначе B.
): AllocationResult => {
  // 1. Создаем уникальный ключ для пары Пользователь-Эксперимент
  const key = `${userId}:${experimentId}`;
  
  // 2. Получаем число от 0 до 99
  const hash = fnv1aHash(key);
  const bucket = hash % 100;

  // 3. Логика распределения (для 50/50)
  // В реальной системе нужно перебирать варианты и суммировать веса.
  // Здесь упрощенно для MVP:
  
  // Если эксперимент 50/50, то 0-49 = Control, 50-99 = Variant B
  if (bucket < 50) {
      const control = variants.find(v => v.isControl) || variants[0];
      return { variantId: control.id, isControl: true, hashValue: bucket };
  } else {
      const variantB = variants.find(v => !v.isControl) || variants[1] || variants[0];
      return { variantId: variantB.id, isControl: false, hashValue: bucket };
  }
};
