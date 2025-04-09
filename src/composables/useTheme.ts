// useTheme.ts
import { onMounted, onUnmounted, ref, watch } from "vue";

export function useTheme() {
  const theme = ref(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );

  const applyTheme = () => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme.value);
    html.style.colorScheme = theme.value;
    localStorage.setItem("theme", theme.value);
  };

  // Watch for theme changes
  watch(theme, (newVal) => {
    applyTheme();
  });

  // System preference listener
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        theme.value = e.matches ? "dark" : "light";
      }
    };
    mediaQuery.addEventListener("change", handler);
    onUnmounted(() => mediaQuery.removeEventListener("change", handler));
  };

  onMounted(() => {
    applyTheme();
    watchSystemTheme();
  });

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  return { theme, toggleTheme };
}
