/**
 * Модуль стану: тримає список справ і єдиний спосіб його змінити.
 *
 * Зверни увагу, чого тут немає: жодного document, жодного querySelector.
 * Цей файл можна запустити в Node і перевірити тестами, бо він
 * нічого не знає про сторінку.
 */

import { loadTasks, saveTasks } from "./storage.js";

/**
 * @typedef {{ id: string, text: string, done: boolean }} Task
 */

/**
 * Приватний стан модуля. Назовні він не експортується — дістатися до нього
 * можна лише через getTasks(), а змінити — лише через addTask/toggleTask.
 * Так неможливо випадково зіпсувати список з іншого файла.
 * @type {Task[]}
 */
let tasks = loadTasks();

/**
 * Слухач, якому повідомляють про кожну зміну стану.
 * Стан не знає, що саме станеться далі: у нашому випадку — перемалювання,
 * але могло б бути й щось інше.
 * @type {(tasks: Task[]) => void}
 */
let onChange = () => {};

/**
 * Підписує функцію на зміни стану.
 * @param {(tasks: Task[]) => void} listener
 */
export function subscribe(listener) {
  onChange = listener;
}

/**
 * Повертає поточний список.
 * @returns {Task[]}
 */
export function getTasks() {
  // Копія, а не сам масив: щоб чужий код не додав нічого повз addTask().
  return [...tasks];
}

/** Зберігає стан і сповіщає підписника. */
function commit() {
  saveTasks(tasks);
  onChange(getTasks());
}

/**
 * Додає справу в початок списку. Порожній рядок ігнорується.
 * @param {string} text
 */
export function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === "") return;

  /** @type {Task} */
  const task = {
    // Власний id, а не індекс: індекси з'їжджають після кожної зміни списку.
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
  };

  tasks = [task, ...tasks];
  commit();
}

/**
 * Перемикає справу між «виконано» і «не виконано».
 * @param {string} id
 */
export function toggleTask(id) {
  // map повертає новий масив — наявні об'єкти не змінюються.
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
  commit();
}

/**
 * Прибирає справу зі списку.
 * @param {string} id
 */
export function deleteTask(id) {
  // filter теж повертає новий масив — без тієї справи, чий id збігся.
  tasks = tasks.filter((task) => task.id !== id);
  commit();
}
