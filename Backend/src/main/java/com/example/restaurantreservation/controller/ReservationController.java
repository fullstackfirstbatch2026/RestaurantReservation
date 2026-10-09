package com.example.restaurantreservation.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.restaurantreservation.repository.ReservationRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<?> getAllReservations() {
        return reservationRepository.getAllReservations();
    }

    @GetMapping("/details")
    public List<Object[]> getReservationDetails() {
        return reservationRepository.getReservationDetails();
    }

    @GetMapping("/above-average")
    public List<Object[]> getTablesReservedMoreThanAverage() {
        return reservationRepository.getTablesReservedMoreThanAverage();
    }

    // Reserve a table
    @PostMapping("/reserve")
    public String reserveTable(
            @RequestParam int customerId,
            @RequestParam int tableId,
            @RequestParam String reservationDate,
            @RequestParam String reservationTime) {

        reservationRepository.reserveTable(
                customerId,
                tableId,
                reservationDate,
                reservationTime
        );

        return "Table reserved successfully";
    }

    // Get total reservation count
    @GetMapping("/count")
    public int getReservationCount() {
        return reservationRepository.getReservationCount();
    }
}