import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/auth/callback",
      name: "AuthCallback",
      component: () => import("../views/AuthCallback.vue"),
    },
    {
      path: "/vocabulary",
      name: "Vocabulary",
      component: () => import("../views/VocabularyPage.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for auth initialization if it's still loading
  if (authStore.isLoading) {
    // Wait a bit for initialization to complete
    await new Promise((resolve) => {
      const checkLoading = setInterval(() => {
        if (!authStore.isLoading) {
          clearInterval(checkLoading);
          resolve(true);
        }
      }, 50);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkLoading);
        resolve(false);
      }, 5000);
    });
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/vocabulary"); // Redirect authenticated users to vocabulary page
  } else {
    next();
  }
});

export default router;
