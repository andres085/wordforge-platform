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
          {{
            isAuthenticated
              ? "Your personal vocabulary journey"
              : "Forge your vocabulary, one week at a time"
          }}
        </p>
      </div>

      <!-- Login CTA for unauthenticated users -->
      <div
        v-if="!isAuthenticated && vocabularyItems.length > 0"
        class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="text-xl font-bold mb-2">Want to track your progress?</h3>
            <p class="text-indigo-100">
              Sign in to get your personal vocabulary set and track completed
              items.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="router.push('/login')"
              class="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all"
            >
              Sign In
            </button>
            <button
              @click="router.push('/register')"
              class="bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-800 transition-all"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
      >
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>

      <!-- Progress Stats (only for authenticated users) -->
      <div
        v-if="isAuthenticated && vocabularyItems.length > 0"
        class="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Your Progress</h3>
            <p class="text-sm text-gray-500">
              {{ completedCount }} of {{ vocabularyItems.length }} items
              completed
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
            {{
              isAuthenticated
                ? "Your Weekly Vocabulary"
                : "This Week's Vocabulary"
            }}
          </h2>
          <span class="text-sm text-gray-500">{{ generatedAt }}</span>
        </div>

        <!-- Vocabulary Cards -->
        <div
          v-for="(item, index) in vocabularyItems"
          :key="item.id"
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
                :id="`item-${item.id}`"
                v-model="item.checked"
                @change="saveProgress(item)"
                :disabled="item.isReadOnly"
                class="w-6 h-6 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                :class="{
                  'cursor-pointer': !item.isReadOnly,
                  'cursor-not-allowed opacity-50': item.isReadOnly,
                }"
              />
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <label
                :for="`item-${item.id}`"
                class="block"
                :class="{
                  'cursor-pointer': !item.isReadOnly,
                  'opacity-60': item.checked,
                }"
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
                    ✓ Completed
                  </span>
                </div>

                <!-- Term and Definition -->
                <div class="mb-4">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">
                    {{ item.term }}
                  </h3>
                  <p class="text-gray-600">{{ item.definition }}</p>
                </div>

                <!-- Example -->
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

      <!-- Loading State -->
      <div
        v-else-if="loading"
        class="bg-white rounded-xl shadow-xl p-12 text-center"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"
        ></div>
        <p class="text-gray-600">Loading vocabulary...</p>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-xl p-12 text-center">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No Vocabulary Available
        </h3>
        <p class="text-gray-500">
          Check back later for this week's vocabulary!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api, useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const vocabularyItems = ref([]);
const loading = ref(false);
const error = ref("");
const generatedAt = ref("");

// Computed property for authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated);

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

// Fetch global set (for unauthenticated users)
const fetchGlobalSet = async () => {
  loading.value = true;
  error.value = "";

  try {
    // BACKEND: This endpoint should already exist and work
    // GET /global-weekly-vocabulary-set/latest
    // - No authentication required
    // - Should return { items: [...], createdAt: Date, ... }
    const response = await api.get("/global-weekly-vocabulary-set/latest");

    if (response.data && response.data.items) {
      vocabularyItems.value = response.data.items.map((item) => ({
        id: item.id,
        category: item.category,
        term: item.term,
        definition: item.definition,
        example: item.example,
        checked: false,
        isReadOnly: true, // Disable checkboxes for unauthenticated users
      }));
      generatedAt.value = new Date(
        response.data.createdAt
      ).toLocaleDateString();
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load vocabulary";
  } finally {
    loading.value = false;
  }
};

// Fetch user's personal set (for authenticated users)
const fetchUserSet = async () => {
  loading.value = true;
  error.value = "";

  try {
    // BACKEND TODO: Implement this endpoint in user-weekly-vocabulary-set.controller.ts
    // GET /user-weekly-vocabulary-set/latest
    // - Requires authentication (JwtAuthGuard)
    // - Extract userId from req.user.userId
    // - Call service: findLatestUserSet(userId) with relations: ['items']
    // - Should return { items: [...], createdAt: Date, ... } with isCompleted field on items
    // - Return 404 if user doesn't have a set for current week
    const response = await api.get("/user-weekly-vocabulary-set/latest");

    if (response.data && response.data.items) {
      vocabularyItems.value = response.data.items.map((item) => ({
        id: item.id,
        category: item.category,
        term: item.term,
        definition: item.definition,
        example: item.example,
        checked: item.isCompleted || false,
        isReadOnly: false, // Enable checkboxes for authenticated users
      }));
      generatedAt.value = new Date(
        response.data.createdAt
      ).toLocaleDateString();
    }
  } catch (err) {
    if (err.response?.status === 404) {
      // No user set exists, create one
      try {
        // BACKEND: This endpoint should already exist in user-weekly-vocabulary-set.controller.ts
        // POST /user-weekly-vocabulary-set
        // - Requires authentication (JwtAuthGuard)
        // - Extract userId from req.user.userId
        // - Creates user's copy of 6 items from global weekly set
        // - Service should check if user already has a set for current week
        const response = await api.post("/user-weekly-vocabulary-set");

        // Use the response directly instead of fetching again
        if (response.data && response.data.items) {
          vocabularyItems.value = response.data.items.map((item) => ({
            id: item.id,
            category: item.category,
            term: item.term,
            definition: item.definition,
            example: item.example,
            checked: item.isCompleted || false,
            isReadOnly: false,
          }));
          generatedAt.value = new Date(
            response.data.createdAt
          ).toLocaleDateString();
        }
      } catch (createErr) {
        error.value =
          createErr.response?.data?.message ||
          "Failed to create your vocabulary set";
      }
    } else {
      error.value =
        err.response?.data?.message || "Failed to load your vocabulary";
    }
  } finally {
    loading.value = false;
  }
};

// Save progress to backend (only for authenticated users)
const saveProgress = async (item) => {
  if (!isAuthenticated.value || item.isReadOnly) return;

  try {
    // BACKEND TODO: Update this endpoint in vocabulary.controller.ts
    // PATCH /vocabulary/status/:id
    // - Requires authentication (JwtAuthGuard)
    // - Should update UserVocabularyItem with id = :id
    // - Body: { isUsed: boolean }
    // - Update isCompleted field (and completedAt timestamp)
    // - Verify item belongs to authenticated user (security check!)
    await api.patch(`/vocabulary/status/${item.id}`, {
      isUsed: item.checked,
    });
  } catch (err) {
    console.error("Failed to save progress:", err);
    error.value = "Failed to save progress. Please try again.";
    // Revert the checkbox state on error
    item.checked = !item.checked;
  }
};

// Watch for authentication changes
watch(isAuthenticated, async (newValue, oldValue) => {
  // User just logged in
  if (newValue && !oldValue) {
    await fetchUserSet();
  }
  // User just logged out
  else if (!newValue && oldValue) {
    await fetchGlobalSet();
  }
});

// Initial data fetch
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchUserSet();
  } else {
    await fetchGlobalSet();
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

input[type="checkbox"]:disabled {
  cursor: not-allowed;
}
</style>
