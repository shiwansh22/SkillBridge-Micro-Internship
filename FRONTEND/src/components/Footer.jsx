import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SB</span>
              </div>
              <span className="font-bold">SkillBridge</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting students with real-world opportunities through micro-internships.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/student/dashboard" className="hover:text-foreground transition">
                  Browse Tasks
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-foreground transition">
                  My Certificates
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-foreground transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/task/create" className="hover:text-foreground transition">
                  Post a Task
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 SkillBridge. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground transition">
              LinkedIn
            </a>
            <a href="#" className="hover:text-foreground transition">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
