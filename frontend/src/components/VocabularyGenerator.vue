<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8"
  >
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="text-6xl">🔥</span>
          <h1
            class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            WordForge
          </h1>
        </div>
        <p class="text-gray-600 text-lg">
          Forge your vocabulary, one week at a time
        </p>
      </div>

      <!-- Generate Button -->
      <div class="flex justify-center mb-8">
        <button
          @click="generateVocabulary"
          :disabled="loading"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl disabled:bg-gray-400 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          <span v-if="!loading">✨ Generate Vocabulary</span>
          <span v-else>🔄 Generating...</span>
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
      >
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>

      <!-- Progress Stats -->
      <div
        v-if="vocabularyItems.length > 0"
        class="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Progress</h3>
            <p class="text-sm text-gray-500">
              {{ completedCount }} of {{ vocabularyItems.length }} items used
            </p>
          </div>
          <div class="flex items-center gap-4">
            <div
              class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              {{ completionPercentage }}%
            </div>
            <div class="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vocabulary List -->
      <div v-if="vocabularyItems.length > 0" class="space-y-6 mt-6">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">
            This Week's Vocabulary
          </h2>
          <span class="text-sm text-gray-500">{{ generatedAt }}</span>
        </div>

        <!-- Vocabulary Cards -->
        <div
          v-for="(item, index) in vocabularyItems"
          :key="index"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4"
          :class="[
            item.checked ? 'border-green-500 bg-green-50' : 'border-indigo-500',
          ]"
        >
          <div class="flex items-start gap-4">
            <!-- Checkbox -->
            <div class="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                :id="`item-${index}`"
                v-model="item.checked"
                @change="saveProgress"
                class="w-6 h-6 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
              />
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <label
                :for="`item-${index}`"
                class="cursor-pointer block"
                :class="{ 'opacity-60': item.checked }"
              >
                <!-- Category -->
                <div class="flex items-center gap-2 mb-4">
                  <span
                    class="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full"
                  >
                    {{ item.category }}
                  </span>
                  <span
                    v-if="item.checked"
                    class="text-green-600 text-sm font-medium"
                  >
                    ✓ Used
                  </span>
                </div>

                <!-- Term and Definition -->
                <div class="mb-4">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">
                    {{ item.term }}
                  </h3>
                  <p class="text-gray-600">{{ item.definition }}</p>
                </div>

                <!-- Example(s) -->
                <div class="space-y-3">
                  <p
                    class="text-gray-700 italic pl-4 border-l-2 border-gray-300"
                  >
                    {{ item.example }}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading"
        class="bg-white rounded-xl shadow-xl p-12 text-center"
      >
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No Vocabulary Yet
        </h3>
        <p class="text-gray-500">
          Click the button above to generate your first vocabulary list!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "../stores/auth";

const vocabularyItems = ref([]);
const loading = ref(false);
const error = ref("");
const generatedAt = ref("");

// Computed properties for progress tracking
const completedCount = computed(() => {
  return vocabularyItems.value.filter((item) => item.checked).length;
});

const completionPercentage = computed(() => {
  if (vocabularyItems.value.length === 0) return 0;
  return Math.round(
    (completedCount.value / vocabularyItems.value.length) * 100
  );
});

// Parse the vocabulary text into structured items
const parseVocabulary = (vocabularyItems) => {
  const items = [];

  for (let item of vocabularyItems) {
    // Start a new item
    items.push({
      category: item.category,
      term: item.term,
      definition: item.definition,
      examples: item.example,
      checked: item.isUsed,
    });
  }

  return items;
};

// Save progress to localStorage
const saveProgress = () => {
  localStorage.setItem(
    "wordforge-progress",
    JSON.stringify({
      items: vocabularyItems.value,
      generatedAt: generatedAt.value,
    })
  );
};

// Load progress from localStorage
const loadProgress = () => {
  const saved = localStorage.getItem("wordforge-progress");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      vocabularyItems.value = data.items;
      generatedAt.value = data.generatedAt;
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }
};

const generateVocabulary = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get(
      "http://localhost:3000/weekly-vocabulary-set/latest"
    );

    console.log({ data: response.data });
    if (response.data) {
      vocabularyItems.value = response.data.items;
      generatedAt.value = response.data.createdAt;
      saveProgress();
    } else {
      error.value = response.data.error || "Failed to generate vocabulary";
    }
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to connect to the server";
  } finally {
    loading.value = false;
  }
};

// Load progress on mount
loadProgress();

// Auto-fetch vocabulary from backend when component is mounted
onMounted(() => {
  // If no cached data, fetch from backend
  if (vocabularyItems.value.length === 0) {
    generateVocabulary();
  }
});
</script>

<style scoped>
/* Custom checkbox styling */
input[type="checkbox"] {
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}
</style>
