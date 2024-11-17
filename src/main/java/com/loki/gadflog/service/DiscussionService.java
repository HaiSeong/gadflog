package com.loki.gadflog.service;

import com.loki.gadflog.domain.Collection;
import com.loki.gadflog.domain.Discussion;
import com.loki.gadflog.domain.Relation;
import com.loki.gadflog.dto.DiscussionCreateResponse;
import com.loki.gadflog.dto.DiscussionRequest;
import com.loki.gadflog.dto.DiscussionResponse;
import com.loki.gadflog.repository.CollectionRepository;
import com.loki.gadflog.repository.DiscussionRepository;
import com.loki.gadflog.repository.RelationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final CollectionRepository collectionRepository;
    private final RelationRepository relationRepository;

    @Transactional(readOnly = true)
    public DiscussionResponse getDiscussion(Long id) {
        return discussionRepository.findById(id)
                .map(DiscussionResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 디스커션 입니다."));
    }

    @Transactional
    public DiscussionCreateResponse createDiscussion(DiscussionRequest discussionRequest) {
        Collection collection = collectionRepository.findById(discussionRequest.collectionId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));

        Discussion discussion = discussionRepository.save(discussionRequest.toDiscussion());
        collection.addDiscussion(discussion);

        if (collection.getDiscussions().size() == 1) {
            collection.setRootDiscussionId(discussion.getId());
        }

        if (discussionRequest.hasRelation()) {
            Discussion parent = discussionRepository.findById(discussionRequest.parentId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부모 디스커션입니다."));

            Relation relation = new Relation(parent, discussion, parent.getCollection());
            relationRepository.save(relation);
            return DiscussionCreateResponse.of(discussion, relation);
        }

        return DiscussionCreateResponse.of(discussion, null);
    }

    @Transactional
    public DiscussionResponse updateDiscussion(Long id, DiscussionRequest discussionRequest) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 디스커션 입니다."));

        discussion.update(discussionRequest.title(), discussionRequest.content(), discussionRequest.type());

        return DiscussionResponse.from(discussion);
    }

    @Transactional
    public void deleteDiscussion(Long id) {
        discussionRepository.deleteById(id);
    }
}
