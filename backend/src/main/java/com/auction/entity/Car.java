package com.auction.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String make;

    @NotBlank
    private String model;

    @Min(1900)
    private int year;

    @NotBlank
    private String color;

    @Min(0)
    private int mileage;

    @NotBlank
    private String fuelType;

    @NotBlank
    private String transmission;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @DecimalMin("0.0")
    @Column(name = "starting_price")
    private Double startingPrice;

    @DecimalMin("0.0")
    @Column(name = "current_price")
    private Double currentPrice;

    @Column(name = "auction_end_time")
    private LocalDateTime auctionEndTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private AuctionStatus status = AuctionStatus.UPCOMING;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;

    public enum AuctionStatus {
        UPCOMING, ACTIVE, ENDED, SOLD
    }
}
