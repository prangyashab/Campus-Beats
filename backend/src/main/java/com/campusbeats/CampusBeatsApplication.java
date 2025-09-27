package com.campusbeats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampusBeatsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusBeatsApplication.class, args);
    }

}