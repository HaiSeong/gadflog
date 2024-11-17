package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Relation;

public record RelationResponse(
        Long id,
        Long sourceId,
        Long targetId
) {
    public static RelationResponse from(Relation relation) {
        return new RelationResponse(
                relation.getId(),
                relation.getParent().getId(),
                relation.getChild().getId()
        );
    }
}
