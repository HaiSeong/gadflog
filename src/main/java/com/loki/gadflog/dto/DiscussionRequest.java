package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.DiscussionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DiscussionRequest(
        @NotBlank
        @Size(min = 1, max = 50, message = "제목은 1-50자 사이여야 합니다")
        String title,

        @NotBlank
        @Size(min = 1, max = 2000, message = "내용은 1-2000자 사이여야 합니다")
        String content,

        DiscussionType type,

        Long parentId
) {
    public Discussion toDiscussion() {
        return new Discussion(title, content, type);
    }

    public boolean hasRelation() {
        return parentId != null;
    }
}
