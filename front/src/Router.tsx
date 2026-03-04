import { Route, Routes } from "react-router";
import Login from "./components/Forms/logInForm";
import RequireAuth from "./components/Utils/requireAuth";
import AdminPage from "./pages/admin";
import AlertArticles from "./pages/alertArticles";
import AlertConsumable from "./pages/alertConsumable";
import CalendarPreventives from "./pages/calendar";
import InterventionsInProgress from "./pages/interventionsInProgress";
import InterventionsRequested from "./pages/interventionsRequest";
import LandingPage from "./pages/landigPage";
import MaterialPage from "./pages/material";
import InterventionsPreventives from "./pages/preventives";
import RequestEmployees from "./pages/RequestEmployees";
import StockIn from "./pages/stockIn";
import StockOut from "./pages/stockOut";
import Store from "./pages/store";
import StockHistoryPage from "./pages/storehistory";
import TestHomePage from "./pages/testHomePage";
import InterventionHistory from "./pages/interventionHistory";

export default function Router(){
    return (        
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/accueil/:serviceLabel" element={<TestHomePage />} />
            <Route path="/demandes/:serviceLabel" element={<InterventionsRequested />} />
            <Route path="/encours/:serviceLabel" element={<InterventionsInProgress />} />
            <Route path="/preventifs/:serviceLabel" element={<InterventionsPreventives />} />
            <Route path="/calendrier/:serviceLabel" element={<CalendarPreventives />} />
            <Route path="/materiel/:serviceLabel" element={<MaterialPage />} />
            <Route path="/sos" element={<RequestEmployees />} />
            <Route path="/magasin/:serviceLabel" element={<Store />} />
            <Route path="/magasin/sortie/:serviceLabel" element={<StockOut />} />
            <Route path="/magasin/entree/:serviceLabel" element={<StockIn />} />
            <Route path="/magasin/historique/:serviceLabel" element={<StockHistoryPage />} />
            <Route path="/magasin/recommander/:serviceLabel" element={<AlertArticles />} />
            <Route path="/magasin/consommable/:serviceLabel" element={<AlertConsumable />} />
            <Route path="/historique/:serviceLabel" element={<InterventionHistory />} />
            <Route path="/admin" element={<RequireAuth>  <AdminPage /> </RequireAuth>} />
            <Route path="/admin/login" element={<Login />} />
        </Routes>
    )
};

