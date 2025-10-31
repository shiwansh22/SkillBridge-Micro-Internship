package com.example.controller;

import com.example.model.Application;
import com.example.model.Submission;
import com.example.repository.ApplicationRepository;
import com.example.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping
    public Submission submitWork(@RequestBody Submission submission) {
        return submissionRepository.save(submission);
    }

    @GetMapping("/app/{appId}")
    public List<Submission> getByApplication(@PathVariable Long appId) {
        Application app = applicationRepository.findById(appId).orElseThrow();
        return submissionRepository.findByApplication(app);
    }
}
