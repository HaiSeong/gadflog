package com.loki.gadflog.dto;

import com.loki.gadflog.domain.Collection;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CollectionRequest(
        @NotBlank
        @Size(min = 1, max = 50, message = "제목은 1-50자 사이여야 합니다")
        String title
) {
    public Collection toCollection() {
        return new Collection(title);
    }
}
