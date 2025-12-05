<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  const token = route.query.token as string;

  if (token) {
    // Store access token in memory (not localStorage!)
    authStore.setAccessToken(token);

    // Fetch user profile
    await authStore.fetchUser();

    // Redirect to dashboard
    router.push("/vocabulary");
  } else {
    // No token, something went wrong
    router.push("/login");
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"
      ></div>
      <p class="text-xl font-semibold text-gray-700">Completing sign in...</p>
      <p class="text-sm text-gray-500 mt-2">Please wait a moment</p>
    </div>
  </div>
</template>
