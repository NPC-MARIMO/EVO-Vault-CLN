import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// middleware
import ProtectedRoute from "./middleware/protectedroute";

//layout
import AuthLayout from "./layout/auth.layout";

// auth
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Forgot from "./pages/auth/forgot";

// main
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/dashboard/profile";
import FamilyList from "./pages/family/familylist";
import SingleFamily from "./pages/family/singlefamily";
import FamilySettings from "./pages/family/familysettings";
import VaultViewPage from "./pages/vault/vaultviewpage";
import Notification from "./pages/dashboard/notification";
import NF from "./pages/notfound/nf";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/families" element={<FamilyList />} />
          <Route path="/family/:familyId" element={<SingleFamily />} />
          <Route
            path="/family/:familyId/settings"
            element={<FamilySettings />}
          />
          <Route path="/vault/:vaultId" element={<VaultViewPage />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<NF />} />
      </Routes>
    </Router>
  );
}

export default App;
