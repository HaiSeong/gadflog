package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.DiscussionType;
import com.loki.gadflog.domain.Relation;
import java.time.LocalDateTime;

public record DiscussionCreateResponse(Long id, String title, String content, DiscussionType type,
                                       RelationResponse relationResponse, Long collectionId,
                                       LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static DiscussionCreateResponse of(Discussion discussion, Relation relation) {
        return new DiscussionCreateResponse(
                discussion.getId(),
                discussion.getTitle(),
                discussion.getContent(),
                discussion.getType(),
                relation == null ? null : RelationResponse.from(relation),
                discussion.getCollection().getId(),
                discussion.getCreatedAt(),
                discussion.getUpdatedAt()
        );
    }
}
