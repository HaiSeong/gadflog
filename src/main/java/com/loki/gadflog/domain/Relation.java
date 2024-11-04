package com.loki.gadflog.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
@SQLRestriction("status = 'ACTIVE'")
@SQLDelete(sql = "UPDATE relation SET status = 'DELETED' WHERE id = ?")
@Getter
public class Relation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Discussion parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Discussion child;

    @Enumerated(EnumType.STRING)
    private RelationType type;

    @Enumerated(EnumType.STRING)
    private RelationStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    public Relation(Discussion parent, Discussion child, RelationType type) {
        this(null, parent, child, type, RelationStatus.ACTIVE, null);

        if (parent != null && !parent.getChildren().contains(this)) {
            parent.getChildren().add(this);
        }
        if (child != null && !child.getParents().contains(this)) {
            child.getParents().add(this);
        }
    }
}
