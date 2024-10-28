package com.loki.qg.repository;

import com.loki.qg.domain.Discussion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findAllByOrderByCreatedAtDesc();
}
