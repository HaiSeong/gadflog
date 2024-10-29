package com.loki.gadflog.service;

import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.dto.DiscussionRequest;
import com.loki.gadflog.dto.DiscussionResponse;
import com.loki.gadflog.repository.DiscussionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;

    @Transactional(readOnly = true)
    public List<DiscussionResponse> getDiscussions() {
        return discussionRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(Discussion::isActive)
                .map(DiscussionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DiscussionResponse getDiscussion(Long id) {
        return discussionRepository.findById(id)
                .filter(Discussion::isActive)
                .map(DiscussionResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 디스커션 입니다."));
    }

    @Transactional
    public DiscussionResponse createDiscussion(DiscussionRequest discussionRequest) {
        Discussion discussion = discussionRepository.save(discussionRequest.toDiscussion());

        return DiscussionResponse.from(discussion);
    }

    @Transactional
    public DiscussionResponse updateDiscussion(Long id, DiscussionRequest discussionRequest) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 디스커션 입니다."));

        discussion.update(discussionRequest.title(), discussionRequest.content());

        return DiscussionResponse.from(discussion);
    }

    @Transactional
    public void deleteDiscussion(Long id) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 디스커션 입니다."));

        discussion.delete();
    }
}
