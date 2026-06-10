package com.example.drawingspot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DrawingspotApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrawingspotApplication.class, args);
	}

}
