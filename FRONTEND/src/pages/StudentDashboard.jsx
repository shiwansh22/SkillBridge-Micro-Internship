// "use client";

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../lib/axios";
// import Loader from "../components/Loader";

// export default function StudentDashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("available");

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Try to safely grab local user id
//   const getLocalUserId = () => {
//     try {
//       const raw = localStorage.getItem("user");
//       if (!raw) return null;
//       const u = JSON.parse(raw);
//       return u?.user_id ?? u?.id ?? null;
//     } catch {
//       return null;
//     }
//   };

//   // Normalize many server shapes into an array of apps
//   const normalizeApps = (raw) => {
//     if (!raw) return [];
//     // If axios response object passed directly (res), accept res.data
//     if (raw.data) raw = raw.data;
//     if (Array.isArray(raw)) return raw;
//     if (raw.applications && Array.isArray(raw.applications)) return raw.applications;
//     if (raw.data && Array.isArray(raw.data)) return raw.data;
//     // pick first array value from object
//     const arr = Object.values(raw).find((v) => Array.isArray(v));
//     if (arr) return arr;
//     return [];
//   };

//   const normalizeTasks = (raw) => {
//     if (!raw) return [];
//     if (raw.data) raw = raw.data;
//     if (Array.isArray(raw)) return raw;
//     if (raw.tasks && Array.isArray(raw.tasks)) return raw.tasks;
//     const arr = Object.values(raw).find((v) => Array.isArray(v));
//     if (arr) return arr;
//     return [];
//   };

//   const fetchApplicationsFromSeveralEndpoints = async (userId) => {
//     const endpoints = [
//       // most specific preference order
//       userId ? `/applications/student/${userId}` : null,
//       "/applications/student/me",
//       "/applications",
//       userId ? `/applications?studentId=${userId}` : null,
//       "/applications?role=student",
//     ].filter(Boolean);

//     for (const ep of endpoints) {
//       try {
//         const res = await api.get(ep);
//         console.log(`[StudentDashboard] success ${ep}`, res);
//         const arr = normalizeApps(res.data ?? res);
//         if (arr.length > 0) return arr;
//         // If we got empty array but 200, keep it (maybe there are actually no apps)
//         if (Array.isArray(res.data) && res.data.length === 0) return [];
//         // If response is object and no array found, continue trying other endpoints
//       } catch (err) {
//         console.warn(`[StudentDashboard] failed ${ep}`, err?.response?.status, err?.response?.data || err.message);
//         // try next endpoint
//       }
//     }

//     // none worked; return empty
//     return [];
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");
//     const userId = getLocalUserId();

//     // tasks (single canonical)
//     try {
//       const tasksRes = await api.get("/tasks");
//       setTasks(normalizeTasks(tasksRes.data ?? tasksRes));
//       console.log("[StudentDashboard] tasks response:", tasksRes);
//     } catch (err) {
//       console.error("[StudentDashboard] GET /tasks failed", err?.response?.status, err?.response?.data || err.message);
//       setError("Failed to load tasks (see console)");
//       setTasks([]);
//     }

//     // applications (try several endpoints)
//     try {
//       const apps = await fetchApplicationsFromSeveralEndpoints(userId);
//       setApplications(apps);
//       if (apps.length === 0) {
//         // it's not necessarily an error — app list may be empty; but we log it
//         console.log("[StudentDashboard] applications empty (endpoint returned empty array or none matched)");
//       }
//     } catch (err) {
//       console.error("[StudentDashboard] failed to fetch applications:", err);
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   // fallback form for demo/presentation
//   const DEMO_FORM = "https://forms.gle/2r7f1Jm5k9M3qTkC8";

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
//         <p className="text-muted-foreground">Browse tasks and manage your applications</p>
//       </div>

//       {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

//       <div className="flex gap-4 mb-8 border-b border-border">
//         <button onClick={() => setActiveTab("available")} className={`px-4 py-2 font-medium border-b-2 ${activeTab === "available" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>Available Tasks</button>
//         <button onClick={() => setActiveTab("applied")} className={`px-4 py-2 font-medium border-b-2 ${activeTab === "applied" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>My Applications</button>
//       </div>

//       {activeTab === "available" && (
//         <div className="grid md:grid-cols-2 gap-6">
//           {tasks.length === 0 ? (
//             <p className="text-muted-foreground col-span-full">No tasks available yet</p>
//           ) : (
//             tasks.map((task, idx) => {
//               const id = task.task_id ?? task.id ?? idx;
//               const formLink = task.formLink ?? task.form_link ?? task.applyLink ?? task.apply_link ?? DEMO_FORM;
//               return (
//                 <div key={id} className="bg-card rounded-lg border p-6">
//                   <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
//                   <p className="text-muted-foreground text-sm mb-4">{String(task.description).slice(0, 200)}</p>

//                   <div className="flex justify-between items-center w-full">
//                     <Link to={`/task/${id}`} className="text-primary hover:underline font-medium">View Details</Link>
//                     <a href={formLink} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition" style={{ minWidth: "90px", textAlign: "center" }}>Apply</a>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}

//       {activeTab === "applied" && (
//         <div className="grid md:grid-cols-2 gap-6">
//           {applications.length === 0 ? (
//             <p className="text-muted-foreground col-span-full">You haven't applied to any tasks yet</p>
//           ) : (
//             applications.map((app, i) => {
//               const appId = app.app_id ?? app.id ?? i;
//               const taskObj = app.task ?? app.task_obj ?? {};
//               const title = taskObj.title ?? taskObj.name ?? app.title ?? "Application";
//               const createdAt = app.applied_at ?? app.created_at ?? app.createdAt ?? null;
//               const status = app.status ?? app.state ?? "pending";
//               return (
//                 <div key={appId} className="bg-card rounded-lg border p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-lg font-semibold">{title}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "approved" ? "bg-green-100 text-green-700" : status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{status}</span>
//                   </div>
//                   <p className="text-muted-foreground text-sm mb-4">Applied on {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</p>
//                   {status === "approved" && <Link to={`/submissions/${appId}`} className="text-primary hover:underline">Submit Work</Link>}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import Loader from "../components/Loader";

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalUserId = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u?.user_id ?? u?.id ?? null;
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const userId = getLocalUserId();

    // tasks
    try {
      const tasksRes = await api.get("/tasks");
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data?.data ?? []);
    } catch (err) {
      console.error("GET /tasks failed", err);
      setTasks([]);
      setError("Failed to load tasks");
    }

    // applications (use actual user id endpoint)
    try {
      if (userId) {
        const appsRes = await api.get(`/applications/student/${userId}`);
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data ?? []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.warn("GET /applications failed", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // When student applies: create application record, then open form, then refresh apps
  const handleApply = async (taskId, formLink) => {
    try {
      const userId = getLocalUserId();
      if (!userId) {
        alert("Please login to apply");
        return;
      }

      // create application record in backend
      await api.post("/applications/create", {
        task_id: taskId,
        student_id: userId,
        status: "applied"
      });

      // Open the Google form in new tab
      if (formLink) window.open(formLink, "_blank", "noopener,noreferrer");
      else window.open("https://forms.gle/2r7f1Jm5k9M3qTkC8", "_blank", "noopener,noreferrer");

      // refresh apps so it appears in "My Applications"
      const appsRes = await api.get(`/applications/student/${userId}`);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data ?? []);
      setActiveTab("applied");
      alert("Application recorded and form opened. Check My Applications tab.");
    } catch (err) {
      console.error("Apply failed:", err?.response?.data || err.message);
      alert("Failed to apply. See console for details.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Browse tasks and manage your applications</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <div className="flex gap-4 mb-8 border-b border-border">
        <button onClick={() => setActiveTab("available")}
          className={`px-4 py-2 font-medium border-b-2 ${activeTab === "available" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
          Available Tasks
        </button>
        <button onClick={() => setActiveTab("applied")}
          className={`px-4 py-2 font-medium border-b-2 ${activeTab === "applied" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
          My Applications
        </button>
      </div>

      {activeTab === "available" && (
        <div className="grid md:grid-cols-2 gap-6">
          {(!tasks || tasks.length === 0) ? (
            <p className="text-muted-foreground col-span-full">No tasks available yet</p>
          ) : tasks.map((task, idx) => {
            const id = task.task_id ?? task.id ?? idx;
            const formLink = task.formLink ?? task.form_link ?? task.applyLink ?? task.apply_link ?? null;

            return (
              <div key={id} className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{String(task.description ?? "").slice(0, 200)}</p>

                <div className="flex justify-between items-center w-full">
                  <Link to={`/task/${id}`} className="text-primary hover:underline font-medium">View Details</Link>

                  <button
                    onClick={() => handleApply(id, formLink)}
                    className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition"
                    style={{ minWidth: "90px", textAlign: "center" }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "applied" && (
        <div className="grid md:grid-cols-2 gap-6">
          {(!applications || applications.length === 0) ? (
            <p className="text-muted-foreground col-span-full">You haven't applied to any tasks yet</p>
          ) : applications.map((app, i) => {
            const appId = app.app_id ?? app.id ?? i;
            const taskObj = app.task ?? {};
            const title = taskObj.title ?? "Application";
            const status = app.status ?? "applied";
            const createdAt = app.applied_at ?? app.created_at ?? app.createdAt ?? null;

            return (
              <div key={appId} className="bg-card rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "selected" ? "bg-green-100 text-green-700" : status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{status}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-4">Applied on {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</p>

                {status === "selected" && <Link to={`/submissions/${appId}`} className="text-primary hover:underline">Submit Work</Link>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
