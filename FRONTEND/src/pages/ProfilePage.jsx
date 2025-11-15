// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "../context/AuthContext"
// import api from "../lib/axios"
// import Loader from "../components/Loader"

// export default function ProfilePage() {
//   const { user } = useAuth()
//   const [certificates, setCertificates] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (user?.role === "student") {
//       fetchCertificates()
//     } else {
//       setLoading(false)
//     }
//   }, [user])

//   const fetchCertificates = async () => {
//     try {
//       // Backend recommended route
//       const res = await api.get("/certificates/student/me")
//       setCertificates(res.data)
//     } catch (err) {
//       console.error("Failed to load certificates", err)
//       setCertificates([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) return <Loader />

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-12">
//       <div className="bg-card rounded-lg border border-border p-8 mb-8">
//         <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
//         <p className="text-muted-foreground mb-4">{user?.email}</p>
//         <p className="text-sm text-muted-foreground">
//           Role: <span className="font-semibold capitalize">{user?.role}</span>
//         </p>
//       </div>

//       {user?.role === "student" && (
//         <div>
//           <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>

//           {certificates.length === 0 ? (
//             <p className="text-muted-foreground">You haven't earned any certificates yet</p>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-6">
//               {certificates.map((cert) => (
//                 <div
//                   key={cert.cert_id || cert.id}
//                   className="bg-card rounded-lg border border-border p-6"
//                 >
//                   <h3 className="text-lg font-semibold mb-2">
//                     {cert.taskTitle || cert.task?.title || "Certificate"}
//                   </h3>
//                   <p className="text-muted-foreground text-sm mb-4">
//                     Issued on{" "}
//                     {new Date(cert.issue_date || cert.issuedAt).toLocaleDateString()}
//                   </p>
//                   {cert.pdf_link || cert.certificateUrl ? (
//                     <a
//                       href={cert.pdf_link || cert.certificateUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-primary hover:underline font-medium"
//                     >
//                       View Certificate
//                     </a>
//                   ) : (
//                     <span className="text-muted-foreground text-sm">
//                       No certificate uploaded
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// src/pages/ProfilePage.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import Loader from "../components/Loader";

export default function ProfilePage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoInjected, setIsDemoInjected] = useState(false);

  useEffect(() => {
    if (user?.role === "student") {
      fetchCertificates();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCertificates = async () => {
    setLoading(true);
    setCertificates([]);
    const userId = user?.user_id ?? user?.id ?? null;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // call backend with actual id
      const res = await api.get(`/certificates/student/${userId}`);
      const payload = res.data?.data ?? res.data ?? [];
      setCertificates(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.warn("Failed to load certificates:", err?.response?.status, err?.response?.data || err.message);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const injectDemoCertificates = () => {
    if (isDemoInjected) return;
    const demo = [
      {
        cert_id: "demo-1",
        taskTitle: "Intro to Web Security (Micro-Internship)",
        issue_date: new Date().toISOString(),
        pdf_link: "https://example.com/demo-certificate-1.pdf",
      },
      {
        cert_id: "demo-2",
        taskTitle: "Cloud Basics Project (Micro-Internship)",
        issue_date: new Date().toISOString(),
        pdf_link: "https://example.com/demo-certificate-2.pdf",
      },
    ];
    setCertificates((prev) => [...demo, ...prev]);
    setIsDemoInjected(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
        <p className="text-muted-foreground mb-4">{user?.email}</p>
        <p className="text-sm text-muted-foreground">Role: <span className="font-semibold capitalize">{user?.role}</span></p>
      </div>

      {user?.role === "student" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Certificates</h2>
            <button onClick={injectDemoCertificates} className="px-3 py-1 rounded bg-primary text-white text-sm">
              Inject 2 Demo Certificates
            </button>
          </div>

          {certificates.length === 0 ? (
            <p className="text-muted-foreground">You haven't earned any certificates yet. Click "Inject 2 Demo Certificates" to add sample certs for demo.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert.cert_id || cert.id} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold mb-2">{cert.taskTitle || cert.task?.title || "Certificate"}</h3>
                  <p className="text-muted-foreground text-sm mb-4">Issued on {new Date(cert.issue_date || cert.issuedAt).toLocaleDateString()}</p>
                  {cert.pdf_link || cert.certificateUrl ? (
                    <a href={cert.pdf_link || cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">View Certificate</a>
                  ) : (
                    <span className="text-muted-foreground text-sm">No certificate file</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
