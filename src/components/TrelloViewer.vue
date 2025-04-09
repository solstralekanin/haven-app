<script setup lang="ts">
import { ref } from "vue";
import {
  getBoardCards,
  getBoardLists,
  type TrelloCard,
  type TrelloList
} from "../services/trello";

// State
const authenticated = ref(false);
const loading = ref(false);
const cards = ref<TrelloCard[]>([]);
const lists = ref<TrelloList[]>([]);
const boardId = ref("rW0gJRuy");
const token = ref("");

// Colors for labels
const labelColors: Record<string, string> = {
  green: "#61bd4f",
  yellow: "#f2d600",
  orange: "#ff9f1a",
  red: "#eb5a46",
  purple: "#c377e0",
  blue: "#0079bf",
  sky: "#00c2e0",
  lime: "#51e898",
  pink: "#ff78cb",
  black: "#344563",
};

// Get list name by ID
const getListName = (listId: string) => {
  return lists.value.find(list => list.id === listId)?.name || 'Unknown';
};

// Authentication
const authenticateWithTrello = () => {
  // Use nullish coalescing for fallback
  const defaultToken = import.meta.env.VITE_TRELLO_TOKEN ?? '';
  const userToken = prompt("Enter your Trello token:", defaultToken);
  
  if (userToken) {
    token.value = userToken;
    authenticated.value = true;
    localStorage.setItem("trello_token", userToken);
    loadBoardData();
  }
};

// Load all board data
const loadBoardData = async () => {
  if (!boardId.value.trim()) return;
  
  try {
    loading.value = true;
    
    // Fetch lists and cards in parallel
    const [listsResponse, cardsResponse] = await Promise.all([
      getBoardLists(boardId.value.trim(), token.value),
      getBoardCards(boardId.value.trim(), token.value)
    ]);
    
    lists.value = listsResponse;
    cards.value = cardsResponse;
  } catch (error) {
    console.error("Error fetching board data:", error);
    cards.value = [];
    alert("Failed to fetch board data. Please check your token and try again.");
  } finally {
    loading.value = false;
  }
};

// Check for existing token on load
const storedToken = localStorage.getItem("trello_token");
if (storedToken) {
  token.value = storedToken;
  authenticated.value = true;
  loadBoardData();
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="mx-auto max-w-4xl p-4 font-sans">
    <h1 class="mb-4 text-2xl font-bold text-gray-800">Trello Cards</h1>

    <div v-if="!authenticated" class="rounded-lg bg-gray-50 p-8 text-center">
      <button
        @click="authenticateWithTrello"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
      >
        Connect to Trello
      </button>
    </div>

    <div v-else>
      <!-- Refresh Button -->
      <div class="mb-4">
        <button
          @click="loadBoardData"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          Refresh Data
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center p-8">
        <div class="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-2"></div>
        <p class="text-gray-600">Loading cards...</p>
      </div>

      <!-- Cards List -->
      <div v-else class="space-y-4">
        <div
          v-for="card in cards"
          :key="card.id"
          class="bg-white rounded-lg shadow-sm p-4 border-l-4"
          :style="{ borderLeftColor: labelColors[card.labels[0]?.color] || '#ddd' }"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-800">{{ card.name }}</h3>
              <p v-if="card.desc" class="text-gray-600 text-sm mt-1 line-clamp-2">
                {{ card.desc }}
              </p>
            </div>
            <a
              :href="card.url"
              target="_blank"
              class="text-blue-600 hover:underline text-sm"
            >
              View
            </a>
          </div>
          
          <div class="mt-3 flex justify-between items-center text-xs">
            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {{ getListName(card.idList) }}
            </span>
            <span class="text-gray-500">
              {{ formatDate(card.dateLastActivity) }}
            </span>
          </div>
        </div>

        <div v-if="cards.length === 0" class="text-center text-gray-500 py-8">
          No cards found in this board.
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-500">
        Last loaded: {{ new Date().toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>