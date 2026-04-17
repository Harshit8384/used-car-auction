package com.auction.repository;

import com.auction.entity.Car;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findBySeller(User seller);
    List<Car> findByStatus(Car.AuctionStatus status);

    @Query("SELECT c FROM Car c WHERE " +
           "(:make IS NULL OR LOWER(c.make) LIKE LOWER(CONCAT('%', :make, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    List<Car> searchCars(String make, Car.AuctionStatus status);
}
