// vite.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // state.js тягне за собою storage.js, а той звертається до localStorage.
    // У Node його немає, тому тести запускаються в jsdom: це браузерне
    // оточення, яке Vitest емулює всередині Node.
    environment: "jsdom",
  },
});
