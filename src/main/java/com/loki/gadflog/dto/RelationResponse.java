package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Relation;
import com.loki.gadflog.domain.RelationType;
import java.time.LocalDateTime;

public record RelationResponse(
        Long id,
        Long sourceId,
        Long targetId,
        RelationType type,
        LocalDateTime createdAt
) {
    public static RelationResponse from(Relation relation) {
        return new RelationResponse(
                relation.getId(),
                relation.getSourceId(),
                relation.getTargetId(),
                relation.getType(),
                relation.getCreatedAt()
        );
    }
}
