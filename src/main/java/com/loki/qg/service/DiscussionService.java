package com.loki.qg.service;

import com.loki.qg.domain.Discussion;
import com.loki.qg.dto.DiscussionRequest;
import com.loki.qg.dto.DiscussionResponse;
import com.loki.qg.repository.DiscussionRepository;
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
        return discussionRepository.findAll().stream()
                .map(DiscussionResponse::from)
                .toList();
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

        discussion.updateContent(discussionRequest.content());

        return DiscussionResponse.from(discussion);
    }
}
