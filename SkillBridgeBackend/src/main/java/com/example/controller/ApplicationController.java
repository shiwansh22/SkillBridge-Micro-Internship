////package com.example.controller;
////
////import com.example.model.Application;
////import com.example.model.Task;
////import com.example.model.User;
////import com.example.repository.ApplicationRepository;
////import com.example.repository.TaskRepository;
////import com.example.repository.UserRepository;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.List;
////
////@RestController
////@RequestMapping("/api/applications")
////@CrossOrigin(origins = "http://localhost:3000")
////public class ApplicationController {
////
////    @Autowired
////    private ApplicationRepository applicationRepository;
////
////    @Autowired
////    private TaskRepository taskRepository;
////
////    @Autowired
////    private UserRepository userRepository;
////
////    @PostMapping
////    public Application apply(@RequestBody Application application) {
////        return applicationRepository.save(application);
////    }
////
////    @GetMapping("/student/{studentId}")
////    public List<Application> getByStudent(@PathVariable Long studentId) {
////        User student = userRepository.findById(studentId).orElseThrow();
////        return applicationRepository.findByStudent(student);
////    }
////
////    @GetMapping("/task/{taskId}")
////    public List<Application> getByTask(@PathVariable Long taskId) {
////        Task task = taskRepository.findById(taskId).orElseThrow();
////        return applicationRepository.findByTask(task);
////    }
////
////    @PutMapping("/{id}/status")
////    public Application updateStatus(@PathVariable Long id, @RequestBody String status) {
////        Application app = applicationRepository.findById(id).orElseThrow();
////        app.setStatus(Application.Status.valueOf(status));
////        return applicationRepository.save(app);
////    }
////}
////
//
//package com.example.controller;
//
//import com.example.model.Application;
//import com.example.model.Task;
//import com.example.model.User;
//import com.example.repository.ApplicationRepository;
//import com.example.repository.TaskRepository;
//import com.example.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/applications")
//@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
//public class ApplicationController {
//
//    @Autowired
//    private ApplicationRepository applicationRepository;
//
//    @Autowired
//    private TaskRepository taskRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    // Existing generic save endpoint (keeps backward compatibility)
//    @PostMapping
//    public ResponseEntity<?> apply(@RequestBody Application application) {
//        Application saved = applicationRepository.save(application);
//        return ResponseEntity.ok(saved);
//    }
//
//    /**
//     * Convenient endpoint used by frontend:
//     * POST /api/applications/create
//     * body: { "task_id": 123, "student_id": 456, "status": "applied" }
//     */
//    @PostMapping("/create")
//    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> body) {
//        try {
//            if (!body.containsKey("task_id") || !body.containsKey("student_id")) {
//                return ResponseEntity.badRequest().body("task_id and student_id required");
//            }
//
//            Long taskId = Long.valueOf(body.get("task_id").toString());
//            Long studentId = Long.valueOf(body.get("student_id").toString());
//            String statusStr = (body.get("status") != null) ? body.get("status").toString() : "applied";
//
//            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
//            User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
//
//            Application app = new Application();
//            app.setTask(task);
//            app.setStudent(student);
//            app.setStatus(Application.Status.valueOf(statusStr));
//
//            Application saved = applicationRepository.save(app);
//            return ResponseEntity.ok(saved);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Failed to create application: " + e.getMessage());
//        }
//    }
//
//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
//        try {
//            User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
//            List<Application> apps = applicationRepository.findByStudent(student);
//            return ResponseEntity.ok(apps);
//        } catch (Exception e) {
//            return ResponseEntity.status(404).body("Error: " + e.getMessage());
//        }
//    }
//
//    @GetMapping("/task/{taskId}")
//    public ResponseEntity<?> getByTask(@PathVariable Long taskId) {
//        try {
//            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
//            List<Application> apps = applicationRepository.findByTask(task);
//            return ResponseEntity.ok(apps);
//        } catch (Exception e) {
//            return ResponseEntity.status(404).body("Error: " + e.getMessage());
//        }
//    }
//
//    @PutMapping("/{id}/status")
//    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
//        try {
//            Application app = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
//            app.setStatus(Application.Status.valueOf(status));
//            Application saved = applicationRepository.save(app);
//            return ResponseEntity.ok(saved);
//        } catch (Exception e) {
//            return ResponseEntity.status(400).body("Failed to update status: " + e.getMessage());
//        }
//    }
//}
//

package com.example.controller;

import com.example.model.Application;
import com.example.model.Task;
import com.example.model.User;
import com.example.repository.ApplicationRepository;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Generic save (keeps backward compatibility)
    @PostMapping
    public ResponseEntity<?> apply(@RequestBody Application application) {
        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(saved);
    }

    // Convenient endpoint used by frontend when student clicks Apply
    @PostMapping("/create")
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> body) {
        try {
            if (!body.containsKey("task_id") || !body.containsKey("student_id")) {
                return ResponseEntity.badRequest().body("task_id and student_id required");
            }

            Long taskId = Long.valueOf(body.get("task_id").toString());
            Long studentId = Long.valueOf(body.get("student_id").toString());
            String statusStr = (body.get("status") != null) ? body.get("status").toString() : "applied";

            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
            User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

            Application app = new Application();
            app.setTask(task);
            app.setStudent(student);
            app.setStatus(Application.Status.valueOf(statusStr));

            Application saved = applicationRepository.save(app);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create application: " + e.getMessage());
        }
    }

    // Return applications for a specific student (used by StudentDashboard)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        try {
            User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
            List<Application> apps = applicationRepository.findByStudent(student);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: " + e.getMessage());
        }
    }

    // Return applications by task
    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getByTask(@PathVariable Long taskId) {
        try {
            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
            List<Application> apps = applicationRepository.findByTask(task);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: " + e.getMessage());
        }
    }

    /**
     * NEW: Return all applications received for tasks posted by a recruiter.
     * Frontend (recruiter) should call: GET /api/applications/recruiter/{recruiterId}
     * This finds all tasks where task.recruiter.user_id == recruiterId and returns applications for those tasks.
     */
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> getByRecruiter(@PathVariable Long recruiterId) {
        try {
            User recruiter = userRepository.findById(recruiterId).orElseThrow(() -> new RuntimeException("Recruiter not found"));

            // find tasks posted by recruiter
            List<Task> tasks = taskRepository.findAll()
                    .stream()
                    .filter(t -> t.getRecruiter() != null && Objects.equals(t.getRecruiter().getUser_id(), recruiterId))
                    .collect(Collectors.toList());

            if (tasks.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // for each task, fetch applications and combine
            List<Application> allApps = new ArrayList<>();
            for (Task t : tasks) {
                List<Application> apps = applicationRepository.findByTask(t);
                if (apps != null) allApps.addAll(apps);
            }

            // Optionally sort by applied_at desc if you want recent first
            allApps.sort((a, b) -> {
                if (a.getApplied_at() == null || b.getApplied_at() == null) return 0;
                return b.getApplied_at().compareTo(a.getApplied_at());
            });

            return ResponseEntity.ok(allApps);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Update status (keeps existing contract)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Application app = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
            app.setStatus(Application.Status.valueOf(status));
            Application saved = applicationRepository.save(app);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to update status: " + e.getMessage());
        }
    }

    // Optionally allow deleting an application (if you want)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        return applicationRepository.findById(id)
                .map(a -> {
                    applicationRepository.deleteById(id);
                    return ResponseEntity.ok("Deleted");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Application not found"));
    }
}

