package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.DiscussionType;

public record DiscussionTitleResponse(Long id, String title, DiscussionType type) {
    public static DiscussionTitleResponse from(Discussion discussion) {
        return new DiscussionTitleResponse(
                discussion.getId(),
                discussion.getTitle(),
                discussion.getType()
        );
    }
}
