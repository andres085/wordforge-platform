<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <!-- Navigation -->
    <nav class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-3xl">🔥</span>
          <span class="text-2xl font-bold text-gray-900">WordForge</span>
        </div>

        <div v-if="!authStore.isAuthenticated" class="flex items-center gap-4">
          <RouterLink
            to="/login"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Get Started
          </RouterLink>
        </div>

        <div v-else class="flex items-center gap-4">
          <RouterLink
            to="/vocabulary"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            My Vocabulary
          </RouterLink>
          <button
            @click="authStore.logout()"
            class="text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Forge Your English Vocabulary
        </h1>
        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          Master phrases, idioms, collocations, and more. Get 6 curated
          vocabulary items every week to level up your English.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <RouterLink
            to="/register"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Learning Free
          </RouterLink>
          <RouterLink
            to="/login"
            class="bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-gray-200"
          >
            Sign In
          </RouterLink>
        </div>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-8 mt-20">
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-4xl mb-4">📚</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Weekly Sets</h3>
            <p class="text-gray-600">
              Get 6 new vocabulary items every Monday. Phrases, idioms,
              collocations, and more.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-4xl mb-4">✅</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
            <p class="text-gray-600">
              Mark items as used in real conversations. Build streaks and see
              your growth.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Practical Learning
            </h3>
            <p class="text-gray-600">
              Every item includes definitions and example sentences for
              real-world usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
