package com.klef.soa.docker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.Request;
import com.klef.soa.docker.dto.Response;
import com.klef.soa.docker.entity.GymEquipment;
import com.klef.soa.docker.repository.GymEquipRepository;

@Service
public class GymServiceImpl implements GymService {

    @Autowired
    private GymEquipRepository repo;

    // Helper method to convert GymEquipment Entity to Response DTO
    private Response mapToResponse(GymEquipment gym) {
        return new Response(
            gym.getId(),
            gym.getEquipmentname(),
            gym.getBrand(),
            gym.getPurchaseCost(),
            gym.getWorking()
        );
    }

    @Override
    public Response add(Request request) {
        GymEquipment gym = new GymEquipment();
        gym.setEquipmentname(request.getEquipmentname());
        gym.setBrand(request.getBrand());
        gym.setPurchaseCost(request.getPurchaseCost());
        gym.setWorking(request.getWorking());

        GymEquipment saved = repo.save(gym);
        return mapToResponse(saved);
    }

    @Override
    public List<Response> displayall() {
        List<GymEquipment> list = repo.findAll();
        List<Response> responseList = new ArrayList<>();

        for (GymEquipment gym : list) {
            responseList.add(mapToResponse(gym));
        }

        return responseList;
    }

    @Override
    public Response getById(Long id) {
        GymEquipment gym = repo.findById(id).orElse(null);
        if (gym != null) {
            return mapToResponse(gym);
        }
        return null;
    }

    @Override
    public Response update(Long id, Request request) {
        GymEquipment gym = repo.findById(id).orElse(null);
        if (gym != null) {
            gym.setEquipmentname(request.getEquipmentname());
            gym.setBrand(request.getBrand());
            gym.setPurchaseCost(request.getPurchaseCost());
            gym.setWorking(request.getWorking());

            GymEquipment updated = repo.save(gym);
            return mapToResponse(updated);
        }
        return null;
    }

    @Override
    public String delete(Long id) {
        boolean response = repo.existsById(id);
        if (response) {
            repo.deleteById(id);
            return "record deleted successfully";
        } else {
            return "record not Found to delete";
        }
    }
}
