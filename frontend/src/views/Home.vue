<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
  >
    <!-- Navigation -->
    <nav class="w-full px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔥</span>
          <span
            class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >WordForge</span
          >
        </div>

        <div v-if="!authStore.isAuthenticated" class="flex items-center gap-3">
          <RouterLink
            to="/login"
            class="px-12 py-3 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-all duration-200"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/register"
            class="px-12 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Get Started
          </RouterLink>
        </div>

        <div v-else class="flex items-center gap-3">
          <RouterLink
            to="/vocabulary"
            class="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            My Vocabulary
          </RouterLink>
          <button
            @click="authStore.logout()"
            class="px-5 py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div
      class="w-full px-6 py-20 flex items-center justify-center min-h-[calc(100vh-80px)]"
    >
      <div class="max-w-5xl w-full mx-auto">
        <h1
          class="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight text-center"
        >
          Forge Your English Vocabulary
        </h1>
        <p
          class="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed text-center"
        >
          Master phrases, idioms, collocations, and more. Get 6 curated
          vocabulary items every week to level up your English.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <RouterLink
            to="/vocabulary"
            class="w-full sm:w-auto px-20 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
          >
            Start Learning Free
          </RouterLink>
          <RouterLink
            to="/login"
            class="w-full sm:w-auto px-20 py-5 bg-white text-gray-800 font-semibold text-lg rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300"
          >
            Sign In
          </RouterLink>
        </div>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div class="text-5xl mb-5">📚</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Weekly Sets</h3>
            <p class="text-gray-600 leading-relaxed text-base p-5">
              Get 6 new vocabulary items every Monday. Phrases, idioms,
              collocations, and more.
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div class="text-5xl mb-5">✅</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p class="text-gray-600 leading-relaxed text-base p-5">
              Mark items as used in real conversations. Build streaks and see
              your growth.
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div class="text-5xl mb-5">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              Practical Learning
            </h3>
            <p class="text-gray-600 leading-relaxed text-base p-5">
              Every item includes definitions and example sentences for
              real-world usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
