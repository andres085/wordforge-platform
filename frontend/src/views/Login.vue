<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const handleGoogleLogin = () => {
  authStore.loginWithGoogle();
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
  >
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-4xl">🔥</span>
          <h1 class="text-3xl font-bold text-gray-900">WordForge</h1>
        </div>
        <p class="text-gray-600">Sign in to continue learning</p>
      </div>

      <!-- Google Sign In Button -->
      <button
        @click="handleGoogleLogin"
        class="w-full bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-lg hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-center gap-3 font-medium"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-gray-600">
          Don't have an account?
          <RouterLink
            to="/register"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </RouterLink>
        </p>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-700">
          ← Back to home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
