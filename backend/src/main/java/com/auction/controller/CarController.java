package com.auction.controller;

import com.auction.dto.CarDTO;
import com.auction.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    // Public endpoints
    @GetMapping
    public ResponseEntity<List<CarDTO.CarResponse>> getAllCars(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String status) {

        List<CarDTO.CarResponse> cars;
        if ((make != null && !make.isBlank()) || (status != null && !status.isBlank())) {
            cars = carService.searchCars(make, status);
        } else {
            cars = carService.getAllCars();
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/active")
    public ResponseEntity<List<CarDTO.CarResponse>> getActiveCars() {
        return ResponseEntity.ok(carService.getActiveCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO.CarResponse> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    // Authenticated endpoints
    @PostMapping
    public ResponseEntity<CarDTO.CarResponse> listCar(
            @Valid @RequestBody CarDTO.CarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.listCar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO.CarResponse> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarDTO.CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(Map.of("message", "Car listing deleted successfully"));
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<CarDTO.CarResponse>> getMyCars() {
        return ResponseEntity.ok(carService.getMyCars());
    }
}
