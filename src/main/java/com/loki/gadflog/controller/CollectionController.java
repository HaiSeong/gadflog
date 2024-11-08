package com.loki.gadflog.controller;

import com.loki.gadflog.dto.CollectionRequest;
import com.loki.gadflog.dto.CollectionResponse;
import com.loki.gadflog.dto.DiscussionRequest;
import com.loki.gadflog.dto.DiscussionResponse;
import com.loki.gadflog.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollectionResponse createCollection(@RequestBody @Valid CollectionRequest collectionRequest) {
        return collectionService.createCollection(collectionRequest);
    }

    @GetMapping("{id}")
    public CollectionResponse getCollection(@PathVariable Long id) {
        return collectionService.getCollection(id);
    }

    @PostMapping("{id}/discussions")
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussionResponse createDiscussions(@PathVariable Long id,
                                                @RequestBody @Valid DiscussionRequest discussionRequest) {
        return collectionService.createDiscussion(id, discussionRequest);
    }
}