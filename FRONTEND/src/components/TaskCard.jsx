"use client"

import { Link } from "react-router-dom"

export default function TaskCard({ task, onApply }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs font-medium">
          ${task.budget}
        </span>
      </div>

      <p className="text-muted text-sm mb-3 line-clamp-2">{task.description}</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {task.skills &&
          task.skills.split(",").map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
              {skill.trim()}
            </span>
          ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-muted">
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/task/${task.id}`} className="btn-secondary text-sm">
            View
          </Link>
          {onApply && (
            <button onClick={() => onApply(task.id)} className="btn-primary text-sm">
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
