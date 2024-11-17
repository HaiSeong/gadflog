package com.loki.gadflog.service;

import com.loki.gadflog.domain.Collection;
import com.loki.gadflog.dto.CollectionRequest;
import com.loki.gadflog.dto.CollectionResponse;
import com.loki.gadflog.repository.CollectionRepository;
import com.loki.gadflog.repository.DiscussionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final DiscussionRepository discussionRepository;

    @Transactional
    public CollectionResponse createCollection(CollectionRequest collectionRequest) {
        Collection collection = collectionRepository.save(collectionRequest.toCollection());

        return CollectionResponse.from(collection);
    }

    @Transactional(readOnly = true)
    public List<CollectionResponse> getCollections() {
        return collectionRepository.findAll().stream()
                .map(CollectionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CollectionResponse getCollection(Long id) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));

        return CollectionResponse.from(collection);
    }
}
