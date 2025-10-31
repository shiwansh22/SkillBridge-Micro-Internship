package com.example.controller;

import com.example.model.Application;
import com.example.model.Task;
import com.example.model.User;
import com.example.repository.ApplicationRepository;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Application apply(@RequestBody Application application) {
        return applicationRepository.save(application);
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getByStudent(@PathVariable Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow();
        return applicationRepository.findByStudent(student);
    }

    @GetMapping("/task/{taskId}")
    public List<Application> getByTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        return applicationRepository.findByTask(task);
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestBody String status) {
        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(Application.Status.valueOf(status));
        return applicationRepository.save(app);
    }
}

