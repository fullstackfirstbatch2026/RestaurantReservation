package com.example.restaurantreservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.restaurantreservation.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    @Query(value = "SELECT * FROM reservations", nativeQuery = true)
    List<Reservation> getAllReservations();

    @Query(value = """
        SELECT 
            r.reservation_id,
            c.customer_name,
            t.table_number,
            t.capacity,
            r.reservation_date,
            r.reservation_time
        FROM reservations r
        INNER JOIN customers c
            ON r.customer_id = c.customer_id
        INNER JOIN tables_info t
            ON r.table_id = t.table_id
        """, nativeQuery = true)
    List<Object[]> getReservationDetails();

    @Query(value = """
        SELECT
            t.table_id,
            t.table_number,
            COUNT(r.reservation_id) AS reservation_count
        FROM tables_info t
        INNER JOIN reservations r
            ON t.table_id = r.table_id
        GROUP BY t.table_id, t.table_number
        HAVING COUNT(r.reservation_id) >
        (
            SELECT AVG(reservation_count)
            FROM
            (
                SELECT COUNT(*) AS reservation_count
                FROM reservations
                GROUP BY table_id
            ) AS average_table_counts
        )
        """, nativeQuery = true)
    List<Object[]> getTablesReservedMoreThanAverage();

    // Call stored procedure ReserveTable
    @Modifying
    @Transactional
    @Query(value = "CALL ReserveTable(:customerId, :tableId, :reservationDate, :reservationTime)", nativeQuery = true)
    void reserveTable(
            @Param("customerId") int customerId,
            @Param("tableId") int tableId,
            @Param("reservationDate") String reservationDate,
            @Param("reservationTime") String reservationTime
    );

    // Call function GetReservationCount
    @Query(value = "SELECT GetReservationCount()", nativeQuery = true)
    int getReservationCount();
}