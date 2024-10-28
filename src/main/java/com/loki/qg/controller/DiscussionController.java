package com.loki.qg.controller;

import com.loki.qg.dto.DiscussionRequest;
import com.loki.qg.dto.DiscussionResponse;
import com.loki.qg.service.DiscussionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping
    public DiscussionResponse createDiscussion(@RequestBody DiscussionRequest discussionRequest) {
        return discussionService.createDiscussion(discussionRequest);
    }

    @GetMapping
    public List<DiscussionResponse> getDiscussions() {
        return discussionService.getDiscussions();
    }
}
