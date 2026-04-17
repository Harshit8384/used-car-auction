package com.auction.service;

import com.auction.dto.BidDTO;
import com.auction.entity.Bid;
import com.auction.entity.Car;
import com.auction.entity.User;
import com.auction.repository.BidRepository;
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
public class BidService {

    private final BidRepository bidRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional
    public BidDTO.BidResponse placeBid(BidDTO.BidRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User bidder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + request.getCarId()));

        // Validations
        if (car.getStatus() != Car.AuctionStatus.ACTIVE) {
            throw new RuntimeException("This auction is not active");
        }
        if (LocalDateTime.now().isAfter(car.getAuctionEndTime())) {
            car.setStatus(Car.AuctionStatus.ENDED);
            carRepository.save(car);
            throw new RuntimeException("This auction has already ended");
        }
        if (car.getSeller().getId().equals(bidder.getId())) {
            throw new RuntimeException("You cannot bid on your own listing");
        }
        double minimumBid = car.getCurrentPrice() != null ? car.getCurrentPrice() : car.getStartingPrice();
        if (request.getAmount() <= minimumBid) {
            throw new RuntimeException(
                    String.format("Bid must be greater than current price of ₹%.2f", minimumBid));
        }

        // Save bid
        Bid bid = Bid.builder()
                .amount(request.getAmount())
                .bidder(bidder)
                .car(car)
                .bidTime(LocalDateTime.now())
                .build();
        bidRepository.save(bid);

        // Update car current price
        car.setCurrentPrice(request.getAmount());
        carRepository.save(car);

        return BidDTO.BidResponse.fromEntity(bid);
    }

    public List<BidDTO.BidResponse> getBidsForCar(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        return bidRepository.findByCarOrderByAmountDesc(car).stream()
                .map(BidDTO.BidResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BidDTO.BidResponse> getMyBids() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User bidder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bidRepository.findByBidder(bidder).stream()
                .map(BidDTO.BidResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public BidDTO.BidResponse getHighestBid(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        return bidRepository.findHighestBidForCar(car)
                .map(BidDTO.BidResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("No bids placed yet"));
    }
}
