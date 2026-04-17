package com.auction.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users/me")
    public ResponseEntity<UserService.UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @GetMapping("/users/profile")
    public ResponseEntity<UserService.UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/users/me")
    public ResponseEntity<UserService.UserProfileResponse> updateProfile(
            @RequestBody UserService.UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // Admin endpoints
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserService.UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PutMapping("/admin/users/{id}/promote")
    public ResponseEntity<UserService.UserProfileResponse> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.promoteToAdmin(id));
    }
}
