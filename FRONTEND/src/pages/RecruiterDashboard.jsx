"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function RecruiterDashboard() {
  const [tasks, setTasks] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, appsRes] = await Promise.all([
        api.get("/tasks?recruiterId=me"),
        api.get("/applications/recruiter/me"),
      ])
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks and applications</p>
        </div>
        <Link to="/task/create" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
          Post New Task
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Posted Tasks */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Posted Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">You haven't posted any tasks yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold">${task.budget}</span>
                  <Link to={`/task/${task.id}`} className="text-primary hover:underline font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Applications Received</h2>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-lg border border-border p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{app.student?.name}</h3>
                  <p className="text-muted-foreground text-sm">Applied for: {app.task?.title}</p>
                </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
