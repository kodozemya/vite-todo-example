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
 * можна лише через getTasks(), а змінити лише через addTask, toggleTask
 * і deleteTask.
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

/*
  Нижче три чисті функції: беруть список і повертають новий, нічого не
  читаючи й не записуючи. Саме їх перевіряють тести в state.test.js,
  бо результат залежить лише від аргументів.
*/

/**
 * Повертає новий список зі справою на початку. Порожній рядок не додається:
 * тоді повертається той самий список.
 * @param {Task[]} list
 * @param {string} text
 * @param {string} [id] власний id, а не індекс: індекси з'їжджають після кожної зміни
 * @returns {Task[]}
 */
export function withTaskAdded(list, text, id = crypto.randomUUID()) {
  const trimmed = text.trim();
  if (trimmed === "") return list;
  return [{ id, text: trimmed, done: false }, ...list];
}

/**
 * Повертає новий список, де справа з цим id перемкнута між «виконано» і «не виконано».
 * @param {Task[]} list
 * @param {string} id
 * @returns {Task[]}
 */
export function withTaskToggled(list, id) {
  // map повертає новий масив, а змінена справа стає новим об'єктом.
  return list.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
}

/**
 * Повертає новий список без справи з цим id.
 * @param {Task[]} list
 * @param {string} id
 * @returns {Task[]}
 */
export function withTaskDeleted(list, id) {
  return list.filter((task) => task.id !== id);
}

/**
 * Додає справу в початок списку. Порожній рядок ігнорується.
 * @param {string} text
 */
export function addTask(text) {
  const next = withTaskAdded(tasks, text);
  if (next === tasks) return;
  tasks = next;
  commit();
}

/**
 * Перемикає справу між «виконано» і «не виконано».
 * @param {string} id
 */
export function toggleTask(id) {
  tasks = withTaskToggled(tasks, id);
  commit();
}

/**
 * Прибирає справу зі списку.
 * @param {string} id
 */
export function deleteTask(id) {
  tasks = withTaskDeleted(tasks, id);
  commit();
}
