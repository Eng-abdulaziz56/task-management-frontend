import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "@/features/auth/AuthPage";
import PrivateRoute from "@/features/auth/components/PrivateRoute";
import { TasksPage } from "@/features/tasks";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
