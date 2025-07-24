import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { Login } from "./pages/Login";
import { HODashboard } from "./pages/HODashboard";
import { FODashboard } from "./pages/FODashboard";
import { AssignTask } from "./pages/AssignTask";
import { TaskDetails } from "./pages/TaskDetails";
import { HOTaskDetails } from "./pages/HOTaskDetails";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserManagement } from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"Admin" | "HO" | "FO" | null>(null);

  // Check authentication status on app load
  useEffect(() => {
    const verifyAuthentication = async () => {
      const storedUser = localStorage.getItem("currentUser");
      const storedRole = localStorage.getItem("userRole");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedRole && storedToken) {
        try {
          // Verify token with server
          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: storedToken }),
          });

          const data = await response.json();

          if (data.success) {
            // Token is valid, restore user session
            setCurrentUser(JSON.parse(storedUser));
            setUserRole(storedRole as "Admin" | "HO" | "FO");
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem("currentUser");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Token verification error:", error);
          // On network error, allow user to continue (offline capability)
          setCurrentUser(JSON.parse(storedUser));
          setUserRole(storedRole as "Admin" | "HO" | "FO");
        }
      }
    };

    verifyAuthentication();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Call logout API
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  // Get default route based on user role
  const getDefaultRoute = () => {
    switch (userRole) {
      case "Admin":
        return "/admin-dashboard";
      case "HO":
        return "/ho-dashboard";
      case "FO":
        return "/fo-dashboard";
      default:
        return "/";
    }
  };

  // If not authenticated and not on login page, redirect to login
  if (!currentUser || !userRole) {
    // If already on login page, don't redirect
    if (location.pathname === "/login") {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to appropriate dashboard
  if (location.pathname === "/login") {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return (
    <Layout userRole={userRole} onLogout={handleLogout}>
      <Routes>
        {/* Default route based on user role */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Always available but protected */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <UserManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <p className="text-muted-foreground">
                  System configuration page coming soon...
                </p>
              </div>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
                <p className="text-muted-foreground">
                  System audit logs coming soon...
                </p>
              </div>
            </AdminProtectedRoute>
          }
        />

        {/* HO Routes - Always available */}
        <Route path="/ho-dashboard" element={<HODashboard />} />
        <Route path="/ho-task/:id" element={<HOTaskDetails />} />
        <Route path="/assign-task" element={<AssignTask />} />
        <Route
          path="/team"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Team Management</h2>
              <p className="text-muted-foreground">
                Team management page coming soon...
              </p>
            </div>
          }
        />

        {/* FO Routes - Always available */}
        <Route path="/fo-dashboard" element={<FODashboard />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route
          path="/task/:id/edit"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
              <p className="text-muted-foreground">
                Task editing page coming soon...
              </p>
            </div>
          }
        />
        <Route
          path="/notifications"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-muted-foreground">
                Notifications page coming soon...
              </p>
            </div>
          }
        />

        {/* Common Routes */}
        <Route
          path="/settings"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-muted-foreground">
                Settings page coming soon...
              </p>
            </div>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
