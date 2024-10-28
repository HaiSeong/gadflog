package com.loki.qg.controller;

import com.loki.qg.dto.DiscussionRequest;
import com.loki.qg.dto.DiscussionResponse;
import com.loki.qg.service.DiscussionService;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussionResponse createDiscussion(@RequestBody DiscussionRequest discussionRequest) {
        return discussionService.createDiscussion(discussionRequest);
    }

    @PutMapping("/{id}")
    public DiscussionResponse updateDiscussion(@PathVariable Long id,
                                               @RequestBody DiscussionRequest discussionRequest) {
        return discussionService.updateDiscussion(id, discussionRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDiscussion(@PathVariable Long id) {
        discussionService.deleteDiscussion(id);
    }
}
