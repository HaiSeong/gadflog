package com.loki.qg.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class Discussion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @Enumerated(EnumType.STRING)
    private DiscussionStatus status;

    public Discussion(String content) {
        this(0L, content, DiscussionStatus.ACTIVE);
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void delete() {
        status = DiscussionStatus.DELETED;
    }

    @JsonProperty("active")
    public boolean isActive() {
        return status == DiscussionStatus.ACTIVE;
    }
}
