package com.nexkart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class NexKartApplication {

    public static void main(String[] args) {
        SpringApplication.run(NexKartApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  🛒 NexKart E-Commerce API Started Successfully!");
        System.out.println("  API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
