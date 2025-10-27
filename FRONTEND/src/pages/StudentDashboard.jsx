"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("available")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, appsRes] = await Promise.all([api.get("/tasks"), api.get("/applications/student/me")])
      setTasks(tasksRes.data)
      setApplications(appsRes.data)
    } catch (err) {
      setError("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Browse tasks and manage your applications</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "available"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Available Tasks
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "applied"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          My Applications
        </button>
      </div>

      {/* Available Tasks */}
      {activeTab === "available" && (
        <div className="grid md:grid-cols-2 gap-6">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground col-span-full">No tasks available yet</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition"
              >
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold">${task.budget}</span>
                  <Link to={`/task/${task.id}`} className="text-primary hover:underline font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Applied Tasks */}
      {activeTab === "applied" && (
        <div className="grid md:grid-cols-2 gap-6">
          {applications.length === 0 ? (
            <p className="text-muted-foreground col-span-full">You haven't applied to any tasks yet</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{app.task?.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : app.status === "rejected"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
                {app.status === "approved" && (
                  <Link to={`/submissions/${app.id}`} className="text-primary hover:underline font-medium">
                    Submit Work
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
