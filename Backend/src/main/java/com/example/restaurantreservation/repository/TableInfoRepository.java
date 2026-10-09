package com.example.restaurantreservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.restaurantreservation.entity.TableInfo;

public interface TableInfoRepository extends JpaRepository<TableInfo, Integer> {

    // Get all restaurant tables
    @Query(value = "SELECT * FROM tables_info", nativeQuery = true)
    List<TableInfo> getAllTables();

    // Release a table
    @Modifying
    @Transactional
    @Query(value = "UPDATE tables_info SET availability = 1 WHERE table_id = :tableId",
           nativeQuery = true)
    void releaseTable(@Param("tableId") int tableId);
}