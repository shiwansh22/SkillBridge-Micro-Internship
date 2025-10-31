package com.example.controller;

import com.example.model.Task;
import com.example.model.User;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        // recruiter must exist and be recruiter
        if (task.getRecruiter() == null || task.getRecruiter().getUser_id() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing recruiter id");
        }
        Long rid = task.getRecruiter().getUser_id();
        return userRepository.findById(rid)
                .<ResponseEntity<?>>map(u -> {
                    if (u.getRole() != User.Role.recruiter) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters can create tasks");
                    }
                    Task saved = taskRepository.save(task);
                    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recruiter not found"));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
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
}
