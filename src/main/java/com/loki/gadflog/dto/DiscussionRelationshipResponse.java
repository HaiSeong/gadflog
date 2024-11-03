package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import java.util.List;

public record DiscussionRelationshipResponse(
        List<RelationResponse> parents,
        List<RelationResponse> children
) {
    public static DiscussionRelationshipResponse from(Discussion discussion) {
        return new DiscussionRelationshipResponse(
                discussion.getParents().stream().map(RelationResponse::from).toList(),
                discussion.getChildren().stream().map(RelationResponse::from).toList()
        );
    }
}
