import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import StudentDashboard from "./pages/StudentDashboard"
import RecruiterDashboard from "./pages/RecruiterDashboard"
import ProfilePage from "./pages/ProfilePage"
import TaskDetailPage from "./pages/TaskDetailPage"
import TaskFormPage from "./pages/TaskFormPage"
import SubmissionPage from "./pages/SubmissionPage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["student", "recruiter"]}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="/task/:id" element={<TaskDetailPage />} />

              <Route
                path="/task/create"
                element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/submissions/:appId"
                element={
                  <ProtectedRoute allowedRoles={["student", "recruiter"]}>
                    <SubmissionPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}
