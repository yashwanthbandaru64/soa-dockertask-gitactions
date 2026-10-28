package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.Request;
import com.klef.soa.docker.dto.Response;
import com.klef.soa.docker.service.GymService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/gym")
@CrossOrigin(origins = "*")
public class GymController {

    @Autowired
    private GymService service;

    @GetMapping("/")
    public String demo() {
        return "Crud Service is Running";
    }

    @PostMapping("/Add")
    public ResponseEntity<Response> add(@Valid @RequestBody Request request) {
        return ResponseEntity.status(201).body(service.add(request));
    }

    @GetMapping("/Displayall")
    public ResponseEntity<List<Response>> displayall() {
        return ResponseEntity.status(200).body(service.displayall());
    }

    @GetMapping("/Get/{id}")
    public ResponseEntity<Response> getById(@PathVariable Long id) {
        return ResponseEntity.status(200).body(service.getById(id));
    }

    @PutMapping("/Update/{id}")
    public ResponseEntity<Response> update(@PathVariable Long id, @Valid @RequestBody Request request) {
        return ResponseEntity.status(200).body(service.update(id, request));
    }

    @DeleteMapping("/Delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.status(200).body(service.delete(id));
    }
}
