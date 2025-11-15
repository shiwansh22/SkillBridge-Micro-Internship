//package com.example.controller;
//
//import com.example.model.Task;
//import com.example.model.User;
//import com.example.repository.TaskRepository;
//import com.example.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/tasks")
//@CrossOrigin(origins = "http://localhost:3000")
//public class TaskController {
//
//    @Autowired private TaskRepository taskRepository;
//    @Autowired private UserRepository userRepository;
//
//    @PostMapping
//    public ResponseEntity<?> createTask(@RequestBody Task task) {
//        // recruiter must exist and be recruiter
//        if (task.getRecruiter() == null || task.getRecruiter().getUser_id() == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing recruiter id");
//        }
//        Long rid = task.getRecruiter().getUser_id();
//        return userRepository.findById(rid)
//                .<ResponseEntity<?>>map(u -> {
//                    if (u.getRole() != User.Role.recruiter) {
//                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters can create tasks");
//                    }
//                    Task saved = taskRepository.save(task);
//                    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
//                })
//                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recruiter not found"));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Task>> getAllTasks() {
//        return ResponseEntity.ok(taskRepository.findAll());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
//        return taskRepository.findById(id)
//                .<ResponseEntity<?>>map(t -> ResponseEntity.ok(t))
//                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
//        return taskRepository.findById(id)
//                .<ResponseEntity<?>>map(t -> {
//                    taskRepository.deleteById(id);
//                    return ResponseEntity.ok("Task deleted");
//                })
//                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
//    }
//}






package com.example.controller;

import com.example.model.Task;
import com.example.model.User;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skillbridge-micro-internship.vercel.app"
})
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a task.
     * Accepts flexible JSON:
     *  - nested recruiter: { "recruiter": { "user_id": 1 } }
     *  - flat recruiter_id / recruiterId
     *  - form link as "form_link" or "formLink"
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> body) {
        try {
            // Extract fields
            String title = safeGetString(body, "title");
            String description = safeGetString(body, "description");
            String deadline = safeGetString(body, "deadline");
            String formLink = null;
            if (body.containsKey("form_link")) formLink = safeGetString(body, "form_link");
            if (formLink == null && body.containsKey("formLink")) formLink = safeGetString(body, "formLink");

            // Parse recruiter id from various shapes
            Long recruiterId = extractRecruiterId(body);
            if (recruiterId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing recruiter id");
            }

            Optional<User> recruiterOpt = userRepository.findById(recruiterId);
            if (recruiterOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recruiter not found");
            }

            User recruiter = recruiterOpt.get();
            if (recruiter.getRole() != User.Role.recruiter) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters can create tasks");
            }

            Task task = new Task();
            task.setTitle(title);
            task.setDescription(description);
            task.setDeadline(deadline);
            task.setFormLink(formLink);
            task.setRecruiter(recruiter);

            Task saved = taskRepository.save(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create task: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam(value = "recruiterId", required = false) String recruiterId) {
        List<Task> all = taskRepository.findAll();

        if (recruiterId == null || recruiterId.isBlank()) {
            return ResponseEntity.ok(all);
        }

        // try parse numeric id
        try {
            long rid = Long.parseLong(recruiterId);
            List<Task> filtered = all.stream()
                    .filter(t -> {
                        if (t.getRecruiter() == null) return false;
                        Long rIdObj = t.getRecruiter().getUser_id();
                        return rIdObj != null && rIdObj == rid;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(filtered);
        } catch (NumberFormatException nfe) {
            // recruiterId wasn't numeric — return full list (safe fallback)
            return ResponseEntity.ok(all);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .<ResponseEntity<?>>map(t -> ResponseEntity.ok(t))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .<ResponseEntity<?>>map(t -> {
                    taskRepository.deleteById(id);
                    return ResponseEntity.ok("Task deleted");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
    }

    // -----------------------
    // Helper methods
    // -----------------------
    private String safeGetString(Map<String, Object> m, String key) {
        Object o = m.get(key);
        return o == null ? null : o.toString();
    }

    /**
     * Extract recruiter id from body in multiple formats:
     * - nested: recruiter: { user_id: 5 } OR recruiter: { id: 5 }
     * - flat: recruiter_id: 5 OR recruiterId: 5
     */
    private Long extractRecruiterId(Map<String, Object> body) {
        try {
            // nested recruiter
            Object recruiterObj = body.get("recruiter");
            if (recruiterObj instanceof Map) {
                Map<?, ?> recruiterMap = (Map<?, ?>) recruiterObj;
                Object uid = recruiterMap.get("user_id");
                if (uid == null) uid = recruiterMap.get("id");
                if (uid != null) return parseLongSafe(uid);
            }

            // flat keys
            Object r1 = body.get("recruiter_id");
            if (r1 == null) r1 = body.get("recruiterId");
            if (r1 != null) return parseLongSafe(r1);

            // also check for "recruiterId" spelled other ways
            Object r2 = body.get("recruiter");
            if (r2 instanceof Number) return ((Number) r2).longValue();

        } catch (Exception ignored) {}

        return null;
    }

    private Long parseLongSafe(Object o) {
        if (o == null) return null;
        if (o instanceof Number) return ((Number) o).longValue();
        try {
            return Long.parseLong(o.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
