import { getDefaultStore, useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import { authAtom, authLoadingAtom } from "../stores/authAtom";
import { csrfTokenAtom } from "../stores/csrfAtom";
import api from "../utils/axios";

const AUTH_STORAGE_KEY = 'gmao-auth-user';

// Hook d'authentification
export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const store = getDefaultStore();
  const navigate = useNavigate();

  // Initialise la session utilisateur
  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await userService.getCurrentUser();
      setAuth(user);
      // Persiste l'utilisateur en localStorage pour le mode offline
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      // Récupération du token CSRF
      const res = await api.get("/csrf-token");
      store.set(csrfTokenAtom, res.data.csrfToken);
    } catch (error) {
      // Si offline, restaurer la session depuis localStorage
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        try {
          setAuth(JSON.parse(cached));
        } catch {
          setAuth(null);
        }
      } else {
        console.error("Erreur lors de getCurrentUser:", error);
        setAuth(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setAuth, setIsLoading, store]);

  // Déconnexion de l'utilisateur
  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setAuth(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      navigate("/");
    }
  }, [setAuth, navigate]);

  return {
    user: auth,
    isLoading,
    initAuth,
    logout,
  };
}
