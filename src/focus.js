/**
 * Куди перевести фокус після видалення справи.
 *
 * Цей модуль потрібен лише після кліку по хрестику, тому main.js
 * підвантажує його динамічним import(). Vite кладе такий модуль в окремий
 * чанк (`dist/assets/focus-*.js`), і браузер не завантажує його на старті.
 */

/**
 * Фокус зникає разом із видаленим рядком. Повертаємо його на хрестик
 * справи, яка стала на це місце; якщо видалили останню, то на попередню;
 * якщо список спорожнів, то в поле вводу.
 * @param {HTMLElement} list
 * @param {number} index позиція видаленого рядка
 * @param {HTMLElement} input
 */
export function focusAfterDelete(list, index, input) {
  const next = list.children[Math.min(index, list.children.length - 1)];
  const target = next?.querySelector(".task__delete") ?? input;
  target.focus();
}
