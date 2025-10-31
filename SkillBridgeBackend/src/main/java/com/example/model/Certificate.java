package com.example.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cert_id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp issue_date;

    private String pdf_link;

    // Getters and Setters
    public Long getCert_id() { return cert_id; }
    public void setCert_id(Long cert_id) { this.cert_id = cert_id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public Timestamp getIssue_date() { return issue_date; }
    public void setIssue_date(Timestamp issue_date) { this.issue_date = issue_date; }

    public String getPdf_link() { return pdf_link; }
    public void setPdf_link(String pdf_link) { this.pdf_link = pdf_link; }
}
