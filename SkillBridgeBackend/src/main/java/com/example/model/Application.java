package com.example.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long app_id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    private Status status = Status.applied;

    public enum Status {
        applied, selected, rejected, completed
    }

    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp applied_at;
    

    // Getters and Setters
    public Long getApp_id() { return app_id; }
    public void setApp_id(Long app_id) { this.app_id = app_id;}

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Timestamp getApplied_at() { return applied_at; }
    public void setApplied_at(Timestamp applied_at) { this.applied_at = applied_at; }
}
