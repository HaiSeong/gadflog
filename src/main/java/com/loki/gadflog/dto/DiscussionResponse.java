package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import java.time.LocalDateTime;

public record DiscussionResponse(Long id, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static DiscussionResponse from(Discussion discussion) {
        return new DiscussionResponse(
                discussion.getId(),
                discussion.getContent(),
                discussion.getCreatedAt(),
                discussion.getUpdatedAt()
        );
    }
}
