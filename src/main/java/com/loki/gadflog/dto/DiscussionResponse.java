package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;

public record DiscussionResponse(Long id, String content) {
    public static DiscussionResponse from(Discussion discussion) {
        return new DiscussionResponse(discussion.getId(), discussion.getContent());
    }
}
