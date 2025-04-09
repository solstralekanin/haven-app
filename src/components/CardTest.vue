<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const boardId = "your_board_id";
const apiKey = "your_api_key";
const token = "your_token";

const cards = ref([]);

const fetchCards = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${token}`,
    );
    cards.value = response.data;
  } catch (error) {
    console.error("Error fetching Trello data:", error);
  }
};

onMounted(() => {
  fetchCards();
});
</script>

<template>
  <div>
    <h1>Trello Board Content</h1>
    <ul v-if="cards.length > 0">
      <li v-for="card in cards" :key="card.id">
        {{ card.name }}
      </li>
    </ul>
    <p v-else>No cards found.</p>
  </div>
</template>
