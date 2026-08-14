/**
 * Модуль рендера: перетворює список справ на розмітку.
 *
 * Цей файл читає стан і нічого в ньому не змінює. Він навіть не імпортує
 * state.js — список приходить аргументом. Тому модуль можна перевірити
 * окремо: даєш масив, дивишся, що вийшло в DOM.
 */

/**
 * @typedef {{ id: string, text: string, done: boolean }} Task
 */

/**
 * Будує один рядок списку.
 * @param {Task} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = task.done ? "task task--done" : "task";
  item.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task__checkbox";
  checkbox.checked = task.done;
  checkbox.id = `task-${task.id}`;

  const label = document.createElement("label");
  label.className = "task__text";
  label.htmlFor = checkbox.id;

  /*
    textContent, а не innerHTML: текст справи ввів користувач, і рядок
    <img src=x onerror=alert(1)> має лишитися текстом, а не стати розміткою.
  */
  label.textContent = task.text;

  /*
    Хрестик видалення з макета. type="button" обов'язковий: кнопка без type
    усередині форми вважається submit — тут форми немає, але звичка ставити
    type рятує рівно тоді, коли розмітку колись перенесуть у форму.
  */
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "task__delete";
  remove.textContent = "✕";
  /*
    Сам символ ✕ читалка прочитала б як «хрестик» — і незрозуміло, що він
    видалить. aria-label каже це словами, а setAttribute кладе значення
    як текст, тож текст справи знову лишається текстом, не розміткою.
  */
  remove.setAttribute("aria-label", `Видалити справу: ${task.text}`);

  item.append(checkbox, label, remove);
  return item;
}

/**
 * Перемальовує список і порожнє повідомлення.
 * @param {Task[]} tasks
 * @param {{ list: HTMLElement, empty: HTMLElement }} elements
 */
export function renderTasks(tasks, { list, empty }) {
  list.replaceChildren(...tasks.map(createTaskElement));
  empty.hidden = tasks.length > 0;
}
