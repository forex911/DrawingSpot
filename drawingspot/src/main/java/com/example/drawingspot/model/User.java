package com.example.drawingspot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // USER / ADMIN

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_google_user", nullable = false, columnDefinition = "boolean default false")
    private boolean isGoogleUser = false;

    // One user can have multiple orders — @JsonIgnore breaks the circular
    // reference cycle (Order → User → orders → Order → ...) that causes
    // Jackson to silently return {} when serializing orders.
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}