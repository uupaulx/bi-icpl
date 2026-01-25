import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { createClient } from "@/lib/supabase/browser";
import { getUserByEmail, updateLastLogin, upsertUser } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _refreshing: boolean; // Guard against concurrent refreshUser calls

  // Actions
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _refreshing: false,

      signInWithMicrosoft: async () => {
        set({ isLoading: true });

        try {
          const supabase = createClient();

          const { error } = await supabase.auth.signInWithOAuth({
            provider: "azure",
            options: {
              scopes: "email profile openid",
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            console.error("OAuth error:", error);
            set({ isLoading: false });
          }
          // Note: Loading stays true during redirect
        } catch (error) {
          console.error("Sign in error:", error);
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true });

        try {
          const supabase = createClient();
          await supabase.auth.signOut();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error("Sign out error:", error);
          set({ isLoading: false });
        }
      },

      refreshUser: async () => {
        // Guard against concurrent calls (React Strict Mode, etc.)
        if (get()._refreshing) {
          console.log("refreshUser already in progress, skipping...");
          return;
        }

        set({ isLoading: true, _refreshing: true });

        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (authUser?.email) {
            // Get user from our users table
            const user = await getUserByEmail(authUser.email);

            if (user) {
              // Update last login
              await updateLastLogin(user.id);

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                _refreshing: false,
              });
            } else {
              // User authenticated but not in our users table yet
              // Auto-create user from OAuth data
              console.log("Creating user from OAuth:", authUser.email);

              const displayName =
                authUser.user_metadata?.name ||
                authUser.user_metadata?.full_name ||
                authUser.user_metadata?.preferred_username ||
                authUser.email.split("@")[0];

              const newUser = await upsertUser({
                id: authUser.id, // Must match auth.users.id for RLS
                email: authUser.email,
                displayName,
                avatarUrl: authUser.user_metadata?.avatar_url,
              });

              if (newUser) {
                set({
                  user: newUser,
                  isAuthenticated: true,
                  isLoading: false,
                  _refreshing: false,
                });
              } else {
                console.error("Failed to create user");
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  _refreshing: false,
                });
              }
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              _refreshing: false,
            });
          }
        } catch (error) {
          // Ignore AbortError (caused by React Strict Mode or navigation)
          if (error instanceof Error && error.name === "AbortError") {
            console.log("Request aborted (normal during navigation)");
            set({ _refreshing: false });
            return;
          }
          console.error("Refresh user error:", error);
          set({ isLoading: false, _refreshing: false });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "bi-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
