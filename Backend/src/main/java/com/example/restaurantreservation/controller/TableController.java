package com.example.restaurantreservation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restaurantreservation.entity.TableInfo;
import com.example.restaurantreservation.repository.TableInfoRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tables")
public class TableController {

    private final TableInfoRepository tableInfoRepository;

    public TableController(TableInfoRepository tableInfoRepository) {
        this.tableInfoRepository = tableInfoRepository;
    }

    // Get all tables
    @GetMapping
    public List<TableInfo> getAllTables() {
        return tableInfoRepository.getAllTables();
    }

    // Release a table
    @PutMapping("/release/{tableId}")
    public String releaseTable(@PathVariable int tableId) {

        tableInfoRepository.releaseTable(tableId);

        return "Table " + tableId + " released successfully";
    }
}