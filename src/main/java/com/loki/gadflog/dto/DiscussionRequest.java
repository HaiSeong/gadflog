package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;

public record DiscussionRequest(String content) {
    public Discussion toDiscussion() {
        return new Discussion(content);
    }
}