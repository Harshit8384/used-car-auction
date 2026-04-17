package com.auction.repository;

import com.auction.entity.Bid;
import com.auction.entity.Car;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByCarOrderByAmountDesc(Car car);
    List<Bid> findByBidder(User bidder);

    @Query("SELECT b FROM Bid b WHERE b.car = :car ORDER BY b.amount DESC LIMIT 1")
    Optional<Bid> findHighestBidForCar(Car car);
}
