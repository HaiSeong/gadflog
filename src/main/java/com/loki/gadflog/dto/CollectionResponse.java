package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Collection;
import java.time.LocalDateTime;
import java.util.List;

public record CollectionResponse(Long id, String title, Long rootDiscussionId,
                                 List<DiscussionResponse> discussions, List<RelationResponse> relations,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static CollectionResponse from(Collection collection) {
        return new CollectionResponse(
                collection.getId(),
                collection.getTitle(),
                collection.getRootDiscussionId(),
                collection.getDiscussions().stream().map(DiscussionResponse::from).toList(),
                collection.getRelations().stream().map(RelationResponse::from).toList(),
                collection.getCreatedAt(),
                collection.getUpdatedAt()
        );
    }
}
