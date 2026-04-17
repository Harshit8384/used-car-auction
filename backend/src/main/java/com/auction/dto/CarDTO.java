package com.auction.dto;

import com.auction.entity.Car;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class CarDTO {

    @Data
    public static class CarRequest {
        @NotBlank(message = "Make is required")
        private String make;

        @NotBlank(message = "Model is required")
        private String model;

        @Min(value = 1900, message = "Invalid year")
        private int year;

        @NotBlank(message = "Color is required")
        private String color;

        @Min(value = 0, message = "Mileage cannot be negative")
        private int mileage;

        @NotBlank(message = "Fuel type is required")
        private String fuelType;

        @NotBlank(message = "Transmission is required")
        private String transmission;

        private String description;
        private String imageUrl;

        @DecimalMin(value = "1.0", message = "Starting price must be positive")
        @NotNull(message = "Starting price is required")
        private Double startingPrice;

        @NotNull(message = "Auction end time is required")
        private LocalDateTime auctionEndTime;
    }

    @Data
    public static class CarResponse {
        private Long id;
        private String make;
        private String model;
        private int year;
        private String color;
        private int mileage;
        private String fuelType;
        private String transmission;
        private String description;
        private String imageUrl;
        private Double startingPrice;
        private Double currentPrice;
        private LocalDateTime auctionEndTime;
        private Car.AuctionStatus status;
        private LocalDateTime createdAt;
        private String sellerName;
        private String sellerEmail;
        private Long sellerId;
        private int totalBids;

        public static CarResponse fromEntity(Car car) {
            CarResponse res = new CarResponse();
            res.setId(car.getId());
            res.setMake(car.getMake());
            res.setModel(car.getModel());
            res.setYear(car.getYear());
            res.setColor(car.getColor());
            res.setMileage(car.getMileage());
            res.setFuelType(car.getFuelType());
            res.setTransmission(car.getTransmission());
            res.setDescription(car.getDescription());
            res.setImageUrl(car.getImageUrl());
            res.setStartingPrice(car.getStartingPrice());
            res.setCurrentPrice(car.getCurrentPrice() != null ? car.getCurrentPrice() : car.getStartingPrice());
            res.setAuctionEndTime(car.getAuctionEndTime());
            res.setStatus(car.getStatus());
            res.setCreatedAt(car.getCreatedAt());
            if (car.getSeller() != null) {
                res.setSellerName(car.getSeller().getName());
                res.setSellerEmail(car.getSeller().getEmail());
                res.setSellerId(car.getSeller().getId());
            }
            res.setTotalBids(car.getBids() != null ? car.getBids().size() : 0);
            return res;
        }
    }
}
