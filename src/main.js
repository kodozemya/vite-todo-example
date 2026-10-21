/**
 * Точка входу. Її єдина робота — з'єднати модулі:
 * знайти елементи, підписати стан на рендер, а події — на дії.
 *
 * Тут немає ні логіки списку, ні побудови розмітки. Якщо у main.js
 * почала з'являтися робота зі станом — значить, вона просто ще не
 * переїхала у свій модуль.
 */

// Стилі імпортує JavaScript, а не <link> у розмітці: так Vite бачить їх
// у графі імпортів, збирає, мініфікує й додає хеш до назви файла.
import "./style.css";

import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  subscribe,
} from "./state.js";
import { renderTasks } from "./render.js";

const elements = {
  form: document.getElementById("new-task-form"),
  input: document.getElementById("new-task-input"),
  list: document.getElementById("tasks"),
  empty: document.getElementById("empty"),
};

// Стан більше не знає про DOM, а рендер — про стан. З'єднуємо їх тут.
subscribe((tasks) => renderTasks(tasks, elements));

elements.form.addEventListener("submit", (event) => {
  // Без preventDefault форма перезавантажить сторінку і стан зникне.
  event.preventDefault();

  addTask(elements.input.value);
  elements.input.value = "";
  elements.input.focus();
});

// Делегування: один обробник на весь список замість обробника на кожен чекбокс.
elements.list.addEventListener("change", (event) => {
  if (!event.target.matches(".task__checkbox")) return;

  const item = event.target.closest(".task");
  const { id } = item.dataset;

  toggleTask(id);

  /*
    Рендер побудував список наново, тож чекбокс, який щойно натиснули,
    більше не існує — а разом із ним зник і фокус. Мишею цього не видно,
    а Tab'ом — одразу: після Пробілу фокус падав би на початок сторінки.
    Шукаємо новий чекбокс тієї самої справи й повертаємо фокус на нього.
  */
  document.getElementById(`task-${id}`).focus();
});

/*
  Кліки по хрестику — теж один обробник на весь список.
  closest шукає кнопку від того, куди насправді влучив клік: символ ✕
  усередині кнопки теж є ціллю події, а видаляти має саме кнопка.
*/
elements.list.addEventListener("click", async (event) => {
  const button = event.target.closest(".task__delete");
  if (!button) return;

  const item = button.closest(".task");
  // Позицію запам'ятовуємо ДО видалення: після рендера цього <li> вже немає.
  const index = [...elements.list.children].indexOf(item);
  deleteTask(item.dataset.id);

  /*
    Динамічний import(): модуль фокуса потрібен лише після кліку, тож
    Vite виносить його в окремий чанк, а браузер завантажує його тільки
    тут, під час першого видалення. Далі він уже в кеші модулів.
  */
  const { focusAfterDelete } = await import("./focus.js");
  focusAfterDelete(elements.list, index, elements.input);
});

// Перший рендер: показуємо те, що прочиталося зі сховища при старті.
renderTasks(getTasks(), elements);
