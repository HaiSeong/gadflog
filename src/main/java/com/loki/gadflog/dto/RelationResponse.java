package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Relation;
import java.time.LocalDateTime;

public record RelationResponse(
        Long id,
        Long sourceId,
        Long targetId,
        LocalDateTime createdAt
) {
    public static RelationResponse from(Relation relation) {
        return new RelationResponse(
                relation.getId(),
                relation.getParent().getId(),
                relation.getChild().getId(),
                relation.getCreatedAt()
        );
    }
}
