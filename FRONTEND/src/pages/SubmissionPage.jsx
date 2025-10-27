"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function SubmissionPage() {
  const { appId } = useParams()
  const { user } = useAuth()
  const [application, setApplication] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submissionText, setSubmissionText] = useState("")

  useEffect(() => {
    fetchData()
  }, [appId])

  const fetchData = async () => {
    try {
      const [appRes, subRes] = await Promise.all([
        api.get(`/applications/${appId}`),
        api.get(`/submissions/app/${appId}`),
      ])
      setApplication(appRes.data)
      setSubmissions(subRes.data)
    } catch (err) {
      setError("Failed to load submission page")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      await api.post("/submissions", {
        applicationId: appId,
        content: submissionText,
      })
      setSubmissionText("")
      fetchData()
    } catch (err) {
      setError("Failed to submit work")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Submissions</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Student Submission Form */}
      {user?.role === "student" && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit Your Work</h2>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            required
            rows="6"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            placeholder="Describe your work, include links, code snippets, etc..."
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Work"}
          </button>
        </form>
      )}

      {/* Submissions List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-muted-foreground">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{sub.student?.name}</h3>
                  <span className="text-sm text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-foreground">{sub.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
