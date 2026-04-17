package com.auction.dto;

import com.auction.entity.Bid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class BidDTO {

    @Data
    public static class BidRequest {
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Bid amount must be positive")
        private Double amount;

        @NotNull(message = "Car ID is required")
        private Long carId;
    }

    @Data
    public static class BidResponse {
        private Long id;
        private Double amount;
        private LocalDateTime bidTime;
        private String bidderName;
        private String bidderEmail;
        private Long bidderId;
        private Long carId;
        private String carTitle;

        public static BidResponse fromEntity(Bid bid) {
            BidResponse res = new BidResponse();
            res.setId(bid.getId());
            res.setAmount(bid.getAmount());
            res.setBidTime(bid.getBidTime());
            if (bid.getBidder() != null) {
                res.setBidderName(bid.getBidder().getName());
                res.setBidderEmail(bid.getBidder().getEmail());
                res.setBidderId(bid.getBidder().getId());
            }
            if (bid.getCar() != null) {
                res.setCarId(bid.getCar().getId());
                res.setCarTitle(bid.getCar().getYear() + " " + bid.getCar().getMake() + " " + bid.getCar().getModel());
            }
            return res;
        }
    }
}
