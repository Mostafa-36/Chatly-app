import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { Loader } from "lucide-react";
import useThemeStore from "./store/useThemeStore";
import { useEffect } from "react";

const App = () => {
  const { isCheckingAuth, isAuthenticated, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(
    function () {
      async function check() {
        await checkAuth();
      }
      check();
    },
    [checkAuth]
  );

  if (isCheckingAuth && !isAuthenticated)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
