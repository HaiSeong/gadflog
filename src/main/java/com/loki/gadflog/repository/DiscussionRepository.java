package com.loki.gadflog.repository;

import com.loki.gadflog.domain.Discussion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findAllByOrderByCreatedAtDesc();

    List<Discussion> findAllByCollectionId(Long id);
}
