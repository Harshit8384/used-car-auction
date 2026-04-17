package com.auction.config;

import com.auction.entity.Car;
import com.auction.entity.User;
import com.auction.repository.CarRepository;
import com.auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSampleCars();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@auction.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@auction.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .phoneNumber("9999999999")
                    .build();
            userRepository.save(admin);
            log.info("Admin seeded: admin@auction.com / admin123");
        }

        if (!userRepository.existsByEmail("seller@auction.com")) {
            User seller = User.builder()
                    .name("Demo Seller")
                    .email("seller@auction.com")
                    .password(passwordEncoder.encode("seller123"))
                    .role(User.Role.USER)
                    .phoneNumber("9876543210")
                    .build();
            userRepository.save(seller);
            log.info("Demo seller seeded: seller@auction.com / seller123");
        }
    }

    private void seedSampleCars() {
        if (carRepository.count() == 0) {
            User seller = userRepository.findByEmail("seller@auction.com").orElseThrow();

            Car[] cars = {
                Car.builder()
                    .make("Maruti Suzuki").model("Swift VXI").year(2020)
                    .color("Red").mileage(35000).fuelType("Petrol")
                    .transmission("Manual")
                    .description("Single owner, well maintained. Full service history available.")
                    .startingPrice(500000.0).currentPrice(500000.0)
                    .auctionEndTime(LocalDateTime.now().plusDays(3))
                    .status(Car.AuctionStatus.ACTIVE).seller(seller).build(),

                Car.builder()
                    .make("Hyundai").model("Creta SX").year(2021)
                    .color("White").mileage(28000).fuelType("Diesel")
                    .transmission("Automatic")
                    .description("Excellent condition. Sunroof, all features intact.")
                    .startingPrice(950000.0).currentPrice(950000.0)
                    .auctionEndTime(LocalDateTime.now().plusDays(5))
                    .status(Car.AuctionStatus.ACTIVE).seller(seller).build(),

                Car.builder()
                    .make("Honda").model("City ZX").year(2019)
                    .color("Silver").mileage(55000).fuelType("Petrol")
                    .transmission("Automatic")
                    .description("First owner. Honda service center maintained. Minor scratches.")
                    .startingPrice(750000.0).currentPrice(750000.0)
                    .auctionEndTime(LocalDateTime.now().plusDays(2))
                    .status(Car.AuctionStatus.ACTIVE).seller(seller).build(),

                Car.builder()
                    .make("Tata").model("Nexon EV").year(2022)
                    .color("Blue").mileage(18000).fuelType("Electric")
                    .transmission("Automatic")
                    .description("Battery health 96%. Range 312 km. Includes home charger.")
                    .startingPrice(1400000.0).currentPrice(1400000.0)
                    .auctionEndTime(LocalDateTime.now().plusDays(7))
                    .status(Car.AuctionStatus.ACTIVE).seller(seller).build(),

                Car.builder()
                    .make("Toyota").model("Innova Crysta GX").year(2018)
                    .color("Grey").mileage(80000).fuelType("Diesel")
                    .transmission("Manual")
                    .description("7-seater family SUV. All service records. Non-accident.")
                    .startingPrice(1200000.0).currentPrice(1200000.0)
                    .auctionEndTime(LocalDateTime.now().plusHours(12))
                    .status(Car.AuctionStatus.ACTIVE).seller(seller).build()
            };

            for (Car car : cars) carRepository.save(car);
            log.info("5 sample cars seeded.");
        }
    }
}
