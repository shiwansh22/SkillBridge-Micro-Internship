// // "use client"

// // import { useState } from "react"
// // import { useNavigate, Link } from "react-router-dom"
// // import { useAuth } from "../context/AuthContext"

// // export default function RegisterPage() {
// //   const [name, setName] = useState("")
// //   const [email, setEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const [confirmPassword, setConfirmPassword] = useState("")
// //   const [role, setRole] = useState("student")
// //   const [error, setError] = useState("")
// //   const [loading, setLoading] = useState(false)
// //   const { register } = useAuth()
// //   const navigate = useNavigate()

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setError("")

// //     if (password !== confirmPassword) {
// //       setError("Passwords do not match")
// //       return
// //     }

// //     setLoading(true)

// //     try {
// //       await register(email, password, name, role)
// //       navigate(role === "student" ? "/student/dashboard" : "/recruiter/dashboard")
// //     } catch (err) {
// //       setError(err.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center px-4 py-12">
// //       <div className="w-full max-w-md">
// //         <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
// //           <div className="text-center mb-8">
// //             <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
// //               <span className="text-white font-bold text-xl">SB</span>
// //             </div>
// //             <h1 className="text-2xl font-bold">Create Account</h1>
// //             <p className="text-muted-foreground mt-2">Join SkillBridge today</p>
// //           </div>

// //           {error && (
// //             <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
// //               {error}
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium mb-2">Full Name</label>
// //               <input
// //                 type="text"
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 required
// //                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //                 placeholder="John Doe"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Email</label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 required
// //                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //                 placeholder="you@example.com"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">I am a</label>
// //               <select
// //                 value={role}
// //                 onChange={(e) => setRole(e.target.value)}
// //                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //               >
// //                 <option value="student">Student</option>
// //                 <option value="recruiter">Recruiter</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Password</label>
// //               <input
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 required
// //                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //                 placeholder="••••••••"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Confirm Password</label>
// //               <input
// //                 type="password"
// //                 value={confirmPassword}
// //                 onChange={(e) => setConfirmPassword(e.target.value)}
// //                 required
// //                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //                 placeholder="••••••••"
// //               />
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full bg-primary text-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
// //             >
// //               {loading ? "Creating account..." : "Create Account"}
// //             </button>
// //           </form>

// //           <p className="text-center text-sm text-muted-foreground mt-6">
// //             Already have an account?{" "}
// //             <Link to="/login" className="text-primary hover:underline font-medium">
// //               Sign in
// //             </Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }



// // src/pages/RegisterPage.jsx
// "use client";

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("student");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     setLoading(true);
//     try {
//       await register(email, password, name, role);
//       navigate(role === "student" ? "/student/dashboard" : "/recruiter/dashboard", { replace: true });
//     } catch (err) {
//       setError(err?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // keep your existing JSX layout (same as you provided)
//     <div className="min-h-screen flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold">Create Account</h1>
//             <p className="text-muted-foreground mt-2">Join SkillBridge today</p>
//           </div>

//           {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name, Email, Role, Password, Confirm — same inputs as you posted */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Full Name</label>
//               <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="John Doe" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Email</label>
//               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="you@example.com" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">I am a</label>
//               <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
//                 <option value="student">Student</option>
//                 <option value="recruiter">Recruiter</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Password</label>
//               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Confirm Password</label>
//               <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-primary text-foreground py-2 rounded-lg font-medium">
//               {loading ? "Creating account..." : "Create Account"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground mt-6">
//             Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling register with:", { name, email, password: "••••", role });

      // 🔥 FIXED ARG ORDER HERE
      await register(name, email, password, role);

      navigate(
        role === "student" ? "/student/dashboard" : "/recruiter/dashboard",
        { replace: true }
      );
    } catch (err) {
      const msg =
        typeof err?.message === "string"
          ? err.message
          : JSON.stringify(err.message);

      setError(msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join SkillBridge today</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-foreground py-2 rounded-lg font-medium"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
