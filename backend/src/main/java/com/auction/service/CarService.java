package com.auction.service;

import com.auction.dto.CarDTO;
import com.auction.entity.Car;
import com.auction.entity.User;
import com.auction.repository.CarRepository;
import com.auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public List<CarDTO.CarResponse> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::refreshStatus)
                .map(CarDTO.CarResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CarDTO.CarResponse> getActiveCars() {
        return carRepository.findAll().stream()
                .map(this::refreshStatus)
                .filter(c -> c.getStatus() == Car.AuctionStatus.ACTIVE)
                .map(CarDTO.CarResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CarDTO.CarResponse> searchCars(String make, String status) {
        Car.AuctionStatus auctionStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                auctionStatus = Car.AuctionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + status);
            }
        }
        return carRepository.searchCars(make, auctionStatus).stream()
                .map(this::refreshStatus)
                .map(CarDTO.CarResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CarDTO.CarResponse getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
        return CarDTO.CarResponse.fromEntity(refreshStatus(car));
    }

    @Transactional
    public CarDTO.CarResponse listCar(CarDTO.CarRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getAuctionEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction end time must be in the future");
        }

        Car car = Car.builder()
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .color(request.getColor())
                .mileage(request.getMileage())
                .fuelType(request.getFuelType())
                .transmission(request.getTransmission())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .startingPrice(request.getStartingPrice())
                .currentPrice(request.getStartingPrice())
                .auctionEndTime(request.getAuctionEndTime())
                .status(Car.AuctionStatus.ACTIVE)
                .seller(seller)
                .build();

        return CarDTO.CarResponse.fromEntity(carRepository.save(car));
    }

    @Transactional
    public CarDTO.CarResponse updateCar(Long id, CarDTO.CarRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));

        if (!car.getSeller().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to update this listing");
        }
        if (car.getStatus() == Car.AuctionStatus.ENDED || car.getStatus() == Car.AuctionStatus.SOLD) {
            throw new RuntimeException("Cannot update an ended or sold auction");
        }

        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setColor(request.getColor());
        car.setMileage(request.getMileage());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());
        car.setAuctionEndTime(request.getAuctionEndTime());

        return CarDTO.CarResponse.fromEntity(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));

        User requester = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = requester.getRole() == User.Role.ADMIN;
        boolean isOwner = car.getSeller().getEmail().equals(email);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Not authorized to delete this listing");
        }

        carRepository.delete(car);
    }

    public List<CarDTO.CarResponse> getMyCars() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return carRepository.findBySeller(seller).stream()
                .map(this::refreshStatus)
                .map(CarDTO.CarResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Auto-update auction status based on time
    private Car refreshStatus(Car car) {
        if (car.getStatus() == Car.AuctionStatus.ACTIVE
                && car.getAuctionEndTime() != null
                && LocalDateTime.now().isAfter(car.getAuctionEndTime())) {
            car.setStatus(Car.AuctionStatus.ENDED);
            carRepository.save(car);
        }
        return car;
    }
}
