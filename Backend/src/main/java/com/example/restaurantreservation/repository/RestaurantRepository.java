package com.example.restaurantreservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.restaurantreservation.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    @Query(value = "SELECT * FROM restaurants", nativeQuery = true)
    List<Restaurant> getAllRestaurants();
}