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
      meta: { requiresAuth: false },
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
    // Store the intended destination and redirect to login
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Check if there's a redirect parameter, otherwise go to vocabulary
    const redirect = (to.query.redirect as string) || "/vocabulary";
    next(redirect);
  } else {
    next();
  }
});

export default router;
