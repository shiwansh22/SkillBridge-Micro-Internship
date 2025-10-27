"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function TaskDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`)
      setTask(res.data)
    } catch (err) {
      setError("Failed to load task")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    try {
      setApplying(true)
      await api.post("/applications", { taskId: id })
      alert("Application submitted successfully!")
      navigate("/student/dashboard")
    } catch (err) {
      setError("Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <Loader />

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-6 font-medium">
        ← Back
      </button>

      <div className="bg-card rounded-lg border border-border p-8">
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
        <p className="text-muted-foreground mb-6">{task.description}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Budget</h3>
            <p className="text-2xl font-bold text-primary">${task.budget}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Posted by</h3>
            <p className="text-foreground">{task.recruiter?.name}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {user?.role === "student" && (
          <button
            onClick={handleApply}
            disabled={applying}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  )
}
