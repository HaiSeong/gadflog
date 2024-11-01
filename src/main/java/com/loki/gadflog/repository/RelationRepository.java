package com.loki.gadflog.repository;

import com.loki.gadflog.domain.Relation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelationRepository extends JpaRepository<Relation, Long> {

    List<Relation> findAllBySourceId(Long sourceId);

    List<Relation> findAllByTargetId(Long targetId);
}

