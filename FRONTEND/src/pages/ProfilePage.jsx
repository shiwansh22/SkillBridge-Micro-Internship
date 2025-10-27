"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function ProfilePage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "student") {
      fetchCertificates()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchCertificates = async () => {
    try {
      const res = await api.get(`/certificates/student/${user.id}`)
      setCertificates(res.data)
    } catch (err) {
      console.error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
        <p className="text-muted-foreground mb-4">{user?.email}</p>
        <p className="text-sm text-muted-foreground">
          Role: <span className="font-semibold capitalize">{user?.role}</span>
        </p>
      </div>

      {user?.role === "student" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground">You haven't earned any certificates yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                  <a href={cert.certificateUrl} className="text-primary hover:underline font-medium">
                    View Certificate
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
