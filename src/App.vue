<!-- App.vue -->
<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import { useTheme } from "./composables/useTheme";

const { theme } = useTheme();
</script>

<template>
  <div class="h-full" :class="theme">
    <div
      class="min-h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <NavBar />
      <router-view />
    </div>
  </div>
</template>
