import { describe, it, expect, beforeEach } from "vitest";
import {
  withTaskAdded,
  withTaskToggled,
  withTaskDeleted,
} from "./state.js";
import { loadTasks } from "./storage.js";

const tasks = [
  { id: "a", text: "Купити хліб", done: false },
  { id: "b", text: "Полити квіти", done: true },
];

describe("withTaskAdded", () => {
  it("додає справу на початок і обрізає пробіли", () => {
    const result = withTaskAdded(tasks, "  Написати тести  ", "c");

    expect(result).toEqual([
      { id: "c", text: "Написати тести", done: false },
      ...tasks,
    ]);
  });

  it("ігнорує порожній рядок і рядок із самих пробілів", () => {
    expect(withTaskAdded(tasks, "")).toBe(tasks);
    expect(withTaskAdded(tasks, "   ")).toBe(tasks);
  });

  it("не змінює вхідний масив", () => {
    withTaskAdded(tasks, "Нова справа", "c");

    expect(tasks).toHaveLength(2);
  });
});

describe("withTaskToggled", () => {
  it("перемикає лише справу з потрібним id", () => {
    const result = withTaskToggled(tasks, "a");

    expect(result[0].done).toBe(true);
    expect(result[1]).toBe(tasks[1]);
  });

  it("повторне перемикання повертає справу назад", () => {
    const result = withTaskToggled(withTaskToggled(tasks, "b"), "b");

    expect(result).toEqual(tasks);
  });

  it("не змінює вхідний об'єкт справи", () => {
    withTaskToggled(tasks, "a");

    expect(tasks[0].done).toBe(false);
  });
});

describe("withTaskDeleted", () => {
  it("прибирає справу з потрібним id", () => {
    expect(withTaskDeleted(tasks, "a")).toEqual([tasks[1]]);
  });

  it("з невідомим id лишає список як був", () => {
    expect(withTaskDeleted(tasks, "немає")).toEqual(tasks);
  });
});

describe("loadTasks", () => {
  beforeEach(() => localStorage.clear());

  it("повертає порожній список, якщо в сховищі зіпсований JSON", () => {
    localStorage.setItem("kodozemya-todo", "{не json");

    expect(loadTasks()).toEqual([]);
  });
});
