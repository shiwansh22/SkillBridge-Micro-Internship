package com.example.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long submission_id;

    @ManyToOne
    @JoinColumn(name = "app_id", nullable = false)
    private Application application;

    private String file_link;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp submitted_at;

    // Getters and Setters
    public Long getSubmission_id() { return submission_id; }
    public void setSubmission_id(Long submission_id) { this.submission_id = submission_id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getFile_link() { return file_link; }
    public void setFile_link(String file_link) { this.file_link = file_link; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Timestamp getSubmitted_at() { return submitted_at; }
    public void setSubmitted_at(Timestamp submitted_at) { this.submitted_at = submitted_at; }
}
