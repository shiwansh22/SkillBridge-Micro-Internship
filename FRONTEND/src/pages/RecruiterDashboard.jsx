// "use client";

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../lib/axios";
// import Loader from "../components/Loader";

// export default function RecruiterDashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const safeNormalizeTasks = (raw) => {
//     let payload = raw;
//     if (!payload) return [];
//     if (payload.data && Array.isArray(payload.data)) payload = payload.data;
//     if (payload.tasks && Array.isArray(payload.tasks)) payload = payload.tasks;
//     if (!Array.isArray(payload)) {
//       const arr = Object.values(payload).find((v) => Array.isArray(v));
//       if (arr) payload = arr;
//     }
//     if (!Array.isArray(payload)) return [];
//     return payload;
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");

//     const rawUser = localStorage.getItem("user");
//     const user = rawUser ? JSON.parse(rawUser) : null;
//     const recruiterId = user?.user_id || user?.id || null;

//     try {
//       const tasksRes = await api.get("/tasks");
//       let allTasks = safeNormalizeTasks(tasksRes.data);

//       if (recruiterId) {
//         const filtered = allTasks.filter((t) => {
//           // recruiter field might be nested or flat
//           const rid =
//             (t.recruiter && (t.recruiter.user_id ?? t.recruiter.id)) ??
//             t.recruiter_id ??
//             t.recruiterId ??
//             (t.recruiter ? t.recruiter : null);
//           return rid != null && String(rid) === String(recruiterId);
//         });
//         setTasks(filtered);
//       } else {
//         setTasks(allTasks);
//       }
//     } catch (err) {
//       console.error("Failed to load tasks:", err);
//       setError("Failed to load tasks");
//       setTasks([]);
//     }

//     try {
//       const appsRes = await api.get("/applications/recruiter/me");
//       let appsPayload = appsRes.data;
//       if (appsPayload?.data) appsPayload = appsPayload.data;
//       if (!Array.isArray(appsPayload)) {
//         const arr = Object.values(appsPayload || {}).find((v) => Array.isArray(v));
//         if (arr) appsPayload = arr;
//       }
//       setApplications(Array.isArray(appsPayload) ? appsPayload : []);
//     } catch (err) {
//       console.warn("Failed to load applications:", err);
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (taskId) => {
//     if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;
//     try {
//       await api.delete(`/tasks/${taskId}`);
//       // remove from UI
//       setTasks((prev) => prev.filter((t) => {
//         const id = t.task_id ?? t.id;
//         return String(id) !== String(taskId);
//       }));
//       alert("Task deleted");
//     } catch (err) {
//       console.error("Failed to delete task:", err?.response?.data || err.message);
//       alert("Failed to delete task (see console)");
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
//           <p className="text-muted-foreground">Manage your tasks and applications</p>
//         </div>
//         <Link to="/task/create" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
//           Post New Task
//         </Link>
//       </div>

//       {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

//       {/* Posted Tasks */}
//       <div className="mb-12">
//         <h2 className="text-2xl font-bold mb-6">Your Posted Tasks</h2>
//         {(!tasks || tasks.length === 0) ? (
//           <p className="text-muted-foreground">You haven't posted any tasks yet</p>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-6">
//             {tasks.map((task, i) => {
//               const id = task.task_id ?? task.id ?? i;
//               const title = task.title ?? task.name ?? "Untitled";
//               const description = task.description ?? task.desc ?? "";
//               const formLink = task.formLink ?? task.form_link ?? null;

//               return (
//                 <div key={id} className="bg-card rounded-lg border border-border p-6">
//                   <h3 className="text-lg font-semibold mb-2">{title}</h3>
//                   <p className="text-muted-foreground text-sm mb-4">{String(description).slice(0, 200)}</p>

//                   <div className="flex justify-between items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <Link to={`/task/${id}`} className="text-primary hover:underline font-medium">View Details</Link>
//                       {formLink && (
//                         <a href={formLink} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1 rounded bg-primary text-white">
//                           Open Form
//                         </a>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleDelete(id)}
//                         className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Applications */}
//       <div>
//         <h2 className="text-2xl font-bold mb-6">Applications Received</h2>
//         {(!applications || applications.length === 0) ? (
//           <p className="text-muted-foreground">No applications yet</p>
//         ) : (
//           <div className="space-y-4">
//             {applications.map((app, idx) => {
//               const appId = app.app_id ?? app.id ?? idx;
//               const student = app.student ?? app.user ?? {};
//               const taskObj = app.task ?? {};
//               const status = app.status ?? app.state ?? "pending";
//               return (
//                 <div key={appId} className="bg-card rounded-lg border border-border p-6 flex justify-between items-center">
//                   <div>
//                     <h3 className="font-semibold">{student.name ?? student.fullName ?? "Student"}</h3>
//                     <p className="text-muted-foreground text-sm">Applied for: {taskObj.title ?? taskObj.name ?? "Task"}</p>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     status === "approved" ? "bg-green-100 text-green-700" :
//                     status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
//                   }`}>{status}</span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../lib/axios"
import Loader from "../components/Loader"

export default function RecruiterDashboard() {
  const [tasks, setTasks] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRecruiterId = () => {
    try {
      const raw = localStorage.getItem("user")
      if (!raw) return null
      const u = JSON.parse(raw)
      // try multiple possible id keys
      return u?.user_id ?? u?.id ?? u?.userId ?? null
    } catch {
      return null
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError("")
    const recruiterId = getRecruiterId()

    try {
      // prefer server-side filtering, fall back to all+client filter
      const tasksUrl = recruiterId ? `/tasks?recruiterId=${recruiterId}` : "/tasks"
      const appsUrl = recruiterId ? `/applications/recruiter/${recruiterId}` : "/applications"

      const [tasksRes, appsRes] = await Promise.all([api.get(tasksUrl), api.get(appsUrl)])
      setTasks(tasksRes.data ?? [])
      setApplications(appsRes.data ?? [])
    } catch (err) {
      console.error(err)
      setError("Failed to load dashboard")
      setTasks([])
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task? This action cannot be undone.")) return
    try {
      await api.delete(`/tasks/${taskId}`)
      // remove locally for instant UX
      setTasks((prev) => prev.filter((t) => (t.task_id ?? t.id) !== taskId))
    } catch (err) {
      console.error(err)
      alert("Failed to delete task")
    }
  }

  const getAppKey = (app) => app?.app_id ?? app?.id ?? `${app?.task?.task_id ?? app?.task?.id}-${app?.student?.user_id ?? app?.student?.id}`

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
            {tasks.map((task) => {
              const id = task?.task_id ?? task?.id
              return (
                <div key={id} className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                      {task.skills_required && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Skills:</span> {task.skills_required}
                        </p>
                      )}
                      {task.deadline && (
                        <p className="text-sm text-muted-foreground">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Link
                        to={`/task/${id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleDeleteTask(id)}
                        className="text-sm px-3 py-1 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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
            {applications.map((app) => {
              const key = getAppKey(app)
              const student = app.student ?? app?.student_id ? { name: app.student?.name } : null
              const taskTitle = app.task?.title ?? app?.task?.title ?? "Task"
              const status = app.status ?? app?.status ?? "applied"
              const appliedAt = app.applied_at ?? app?.applied_at ?? app?.createdAt ?? app?.appliedAt

              return (
                <div
                  key={key}
                  className="bg-card rounded-lg border border-border p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{student?.name ?? "Unknown Student"}</h3>
                    <p className="text-muted-foreground text-sm">Applied for: {taskTitle}</p>
                    {appliedAt && (
                      <p className="text-xs text-muted-foreground mt-1">Applied on {new Date(appliedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "selected"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : status === "rejected"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {status}
                    </span>

                    {/* link to view full application or student profile */}
                    <Link
                      to={`/applications/${app?.app_id ?? app?.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      View Application
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
