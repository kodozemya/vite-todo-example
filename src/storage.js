/**
 * Модуль сховища: знає, як покласти список у localStorage і дістати назад.
 * Більше він не знає нічого — ні про DOM, ні про те, що таке «справа».
 *
 * Це і є сенс поділу на модулі: коли завтра список поїде на сервер,
 * зміниться тільки цей файл, а state.js і render.js навіть не помітять.
 */

/** Ключ, під яким список лежить у сховищі браузера. */
const STORAGE_KEY = "kodozemya-todo";

/**
 * Читає список зі сховища.
 * @returns {{ id: string, text: string, done: boolean }[]}
 */
export function loadTasks() {
  /*
    try/catch тут не про обережність, а про реальні випадки:
    JSON.parse кидає помилку на зіпсованому рядку, а сам localStorage
    буває недоступним (жорсткі налаштування приватності).
    Порожній список — прийнятний запасний варіант; падіння на старті — ні.
  */
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Записує список у сховище.
 * @param {{ id: string, text: string, done: boolean }[]} tasks
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Сховище переповнене або заборонене — застосунок має працювати далі.
  }
}
