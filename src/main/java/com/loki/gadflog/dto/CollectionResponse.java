package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Collection;
import java.time.LocalDateTime;
import java.util.List;

public record CollectionResponse(Long id, String title, List<DiscussionResponse> discussions,
                                 List<RelationResponse> responses, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static CollectionResponse from(Collection collection) {
        return new CollectionResponse(
                collection.getId(),
                collection.getTitle(),
                collection.getDiscussions().stream().map(DiscussionResponse::from).toList(),
                collection.getRelations().stream().map(RelationResponse::from).toList(),
                collection.getCreatedAt(),
                collection.getUpdatedAt()
        );
    }
}
