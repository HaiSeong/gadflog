package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.DiscussionType;
import java.time.LocalDateTime;

public record DiscussionResponse(Long id, String title, String content, DiscussionType type,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static DiscussionResponse from(Discussion discussion) {
        return new DiscussionResponse(
                discussion.getId(),
                discussion.getTitle(),
                discussion.getContent(),
                discussion.getType(),
                discussion.getCreatedAt(),
                discussion.getUpdatedAt()
        );
    }
}
