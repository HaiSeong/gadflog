package com.loki.gadflog.repository;

import com.loki.gadflog.domain.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
}
