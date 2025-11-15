// "use client";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../lib/axios";

// export default function TaskFormPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     budget: "",
//     deadline: "",
//     formLink: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const rawUser = localStorage.getItem("user");
//       const user = rawUser ? JSON.parse(rawUser) : null;
//       const recruiterId = user?.user_id || user?.id || null;

//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         budget: formData.budget ? Number(formData.budget) : null,
//         deadline: formData.deadline,
//         form_link: formData.formLink || null,
//         formLink: formData.formLink || null,
//         recruiter: recruiterId ? { user_id: recruiterId } : null,
//         recruiter_id: recruiterId,
//         recruiterId: recruiterId,
//       };

//       console.log("POST /api/tasks payload ->", payload);
//       await api.post("/tasks", payload);
//       alert("Task posted successfully!");
//       navigate("/recruiter/dashboard");
//     } catch (err) {
//       console.error("Failed to post task:", err?.response?.status, err?.response?.data || err.message);
//       const serverMsg = err?.response?.data || "Failed to post task";
//       setError(typeof serverMsg === "string" ? serverMsg : serverMsg?.message || "Failed to post task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-8">Post a New Task</h1>

//       {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

//       <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 space-y-6">
//         <div>
//           <label className="block text-sm font-medium mb-2">Task Title</label>
//           <input type="text" name="title" value={formData.title} onChange={handleChange} required
//             className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Build a React Component" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Description</label>
//           <textarea name="description" value={formData.description} onChange={handleChange} required rows="6"
//             className="w-full px-4 py-2 border rounded-lg" placeholder="Describe the task..." />
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Budget ($)</label>
//             <input type="number" name="budget" value={formData.budget} onChange={handleChange} required
//               className="w-full px-4 py-2 border rounded-lg" placeholder="500" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Deadline</label>
//             <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required
//               className="w-full px-4 py-2 border rounded-lg" />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Application Form URL (Google Form)</label>
//           <input type="url" name="formLink" value={formData.formLink} onChange={handleChange}
//             placeholder="https://docs.google.com/forms/..." className="w-full px-4 py-2 border rounded-lg" />
//           <p className="text-xs text-muted-foreground mt-1">Optional — students will be sent to this form to apply.</p>
//         </div>

//         {/* Visible fallback styling: uses bg-primary if available, otherwise teal background */}
//         <button type="submit" disabled={loading}
//           className="w-full py-2 rounded-lg font-medium text-white"
//           style={{ backgroundColor: "var(--primary, #0ea5a4)" }}>
//           {loading ? "Posting..." : "Post Task"}
//         </button>
//       </form>
//     </div>
//   );
// }




// src/pages/TaskForm.jsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function TaskFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    formLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const recruiterId = user?.user_id || user?.id || null;

      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        form_link: formData.formLink || null,
        formLink: formData.formLink || null,
        recruiter: recruiterId ? { user_id: recruiterId } : null,
        recruiter_id: recruiterId,
        recruiterId: recruiterId,
      };

      console.log("POST /api/tasks payload ->", payload);
      await api.post("/tasks", payload);
      alert("Task posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error("Failed to post task:", err?.response?.status, err?.response?.data || err.message);
      const serverMsg = err?.response?.data || "Failed to post task";
      setError(typeof serverMsg === "string" ? serverMsg : serverMsg?.message || "Failed to post task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Task</h1>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., Build a React Component"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Describe the task..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Application Form URL (Google Form)</label>
          <input
            type="url"
            name="formLink"
            value={formData.formLink}
            onChange={handleChange}
            placeholder="https://docs.google.com/forms/..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-xs text-muted-foreground mt-1">Optional — students will be sent to this form to apply.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--primary, #0ea5a4)" }}
        >
          {loading ? "Posting..." : "Post Task"}
        </button>
      </form>
    </div>
  );
}
