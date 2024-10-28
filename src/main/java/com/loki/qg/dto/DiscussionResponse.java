package com.loki.qg.dto;

import com.loki.qg.domain.Discussion;

public record DiscussionResponse(Long id, String content) {
    public static DiscussionResponse from(Discussion discussion) {
        return new DiscussionResponse(discussion.getId(), discussion.getContent());
    }
}
