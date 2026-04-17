package com.auction.controller;

import com.auction.dto.BidDTO;
import com.auction.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    public ResponseEntity<BidDTO.BidResponse> placeBid(
            @Valid @RequestBody BidDTO.BidRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bidService.placeBid(request));
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<BidDTO.BidResponse>> getBidsForCar(@PathVariable Long carId) {
        return ResponseEntity.ok(bidService.getBidsForCar(carId));
    }

    @GetMapping("/car/{carId}/highest")
    public ResponseEntity<BidDTO.BidResponse> getHighestBid(@PathVariable Long carId) {
        return ResponseEntity.ok(bidService.getHighestBid(carId));
    }

    @GetMapping("/my-bids")
    public ResponseEntity<List<BidDTO.BidResponse>> getMyBids() {
        return ResponseEntity.ok(bidService.getMyBids());
    }
}
