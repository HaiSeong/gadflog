package com.loki.gadflog.controller;

import com.loki.gadflog.dto.DiscussionRelationshipResponse;
import com.loki.gadflog.dto.DiscussionRequest;
import com.loki.gadflog.dto.DiscussionResponse;
import com.loki.gadflog.service.DiscussionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @GetMapping
    public List<DiscussionResponse> getDiscussions() {
        return discussionService.getDiscussions();
    }

    @GetMapping("/{id}")
    public DiscussionResponse getDiscussion(@PathVariable Long id) {
        return discussionService.getDiscussion(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussionResponse createDiscussion(@RequestBody @Valid DiscussionRequest discussionRequest) {
        return discussionService.createDiscussion(discussionRequest);
    }

    @PutMapping("/{id}")
    public DiscussionResponse updateDiscussion(@PathVariable Long id,
                                               @RequestBody @Valid DiscussionRequest discussionRequest) {
        return discussionService.updateDiscussion(id, discussionRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDiscussion(@PathVariable Long id) {
        discussionService.deleteDiscussion(id);
    }

    @GetMapping("/{id}/relations")
    public DiscussionRelationshipResponse getRelationship(@PathVariable Long id) {
        return discussionService.getRelationship(id);
    }
}
