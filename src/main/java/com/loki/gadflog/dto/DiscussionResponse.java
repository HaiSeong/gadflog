package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.DiscussionType;
import java.time.LocalDateTime;

public record DiscussionResponse(Long id, String title, String content, DiscussionType type,
                                 Long collectionId, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static DiscussionResponse from(Discussion discussion) {
        return new DiscussionResponse(
                discussion.getId(),
                discussion.getTitle(),
                discussion.getContent(),
                discussion.getType(),
                discussion.getCollection().getId(),
                discussion.getCreatedAt(),
                discussion.getUpdatedAt()
        );
    }
}
