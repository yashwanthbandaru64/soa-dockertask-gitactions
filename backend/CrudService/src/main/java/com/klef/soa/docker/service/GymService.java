package com.klef.soa.docker.service;

import java.util.List;
import com.klef.soa.docker.dto.Request;
import com.klef.soa.docker.dto.Response;

public interface GymService {
    Response add(Request request);
    List<Response> displayall();
    Response getById(Long id);
    Response update(Long id, Request request);
    String delete(Long id);
}
