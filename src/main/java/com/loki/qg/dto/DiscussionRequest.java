package com.loki.qg.dto;

import com.loki.qg.domain.Discussion;

public record DiscussionRequest(String content) {
    public Discussion toDiscussion() {
        return new Discussion(content);
    }
}
