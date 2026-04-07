import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import Router from "./Router.tsx"
import { useOfflineSync } from "./hooks/useOfflineSync.ts";
import { usePrecache } from "./hooks/usePrecache.ts";
import { AuthProvider } from "./utils/authContext.tsx";
// import { fetchCsrfToken } from "./utils/csrf.ts"
import { SocketProvider } from "./utils/SocketContext.tsx";
import { restoreFromStorage, scheduleSave } from "./utils/queryPersister.ts";


const container = document.getElementById("root")
if (!container) {
  throw new Error("Root container missing in index.html")
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Données considérées fraîches pendant 5 minutes
      staleTime: 5 * 60 * 1000,
      // Garde le cache en mémoire 24h (ne jette pas les données inutilisées)
      gcTime: 24 * 60 * 60 * 1000,
      // Continuer à afficher les données en cache même si la requête échoue
      retry: (failureCount: number, _error: unknown) => {
        if (!navigator.onLine) return false; // pas de retry offline
        return failureCount < 2;
      },
    },
  },
});

// Restaurer le cache depuis localStorage au démarrage
restoreFromStorage(queryClient);

// Sauvegarder le cache à chaque mise à jour réussie
queryClient.getQueryCache().subscribe((event: { type: string; query: { state: { status: string } } }) => {
  if (event.type === 'updated' && event.query.state.status === 'success') {
    scheduleSave(queryClient);
  }
});



function OfflineSyncHandler() {
  useOfflineSync();
  usePrecache();
  return null;
}

export function App (){

  // const [csrfReady, setCsrfReady] = useState(false);

  // useEffect(() => {
  //   fetchCsrfToken()
  //     .then(() => setCsrfReady(true))
  //     .catch(() => {
  //       console.error("Erreur récupération CSRF token");
  //       setCsrfReady(true); // pour ne pas bloquer l'app
  //     });
  // }, []);

  // if (!csrfReady) {
  //   return <div>Chargement...</div>; // loader pendant la récupération
  // }

  return(
  <QueryClientProvider client={queryClient}>
    {/* <JotaiProvider> */}
    <AuthProvider>
      <BrowserRouter>
       <SocketProvider>
          <OfflineSyncHandler />
          <Router />
       </SocketProvider>
      </BrowserRouter>
    </AuthProvider>

    {/* </JotaiProvider> */}
  </QueryClientProvider>)
} 

createRoot(container).render(
  <App />
)