package com.loki.qg.controller;

import com.loki.qg.dto.DiscussionRequest;
import com.loki.qg.dto.DiscussionResponse;
import com.loki.qg.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping("/discussions")
    public DiscussionResponse createDiscussion(@RequestBody DiscussionRequest discussionRequest) {
        return discussionService.createDiscussion(discussionRequest);
    }
}
