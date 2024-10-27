package com.loki.qg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.loki.qg")
public class QuestionGraphApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestionGraphApplication.class, args);
    }

}
