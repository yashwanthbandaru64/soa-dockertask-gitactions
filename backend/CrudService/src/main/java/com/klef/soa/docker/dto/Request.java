package com.klef.soa.docker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Request DTO for adding/updating gym equipment")
public class Request {

    @NotBlank(message = "Equipment name is required and cannot be blank")
    @Schema(description = "Name of the gym equipment", example = "Treadmill")
    private String equipmentname;

    @NotBlank(message = "Brand name is required and cannot be blank")
    @Schema(description = "Brand or manufacturer", example = "LifeFitness")
    private String brand;

    @NotNull(message = "Purchase cost is required")
    @Positive(message = "Purchase cost must be greater than zero")
    @Schema(description = "Purchase cost in currency units", example = "45000.00")
    private Double purchaseCost;

    @NotNull(message = "Working condition status is required (true or false)")
    @Schema(description = "Whether equipment is functional", example = "true")
    private Boolean working;

    public Request() {
    }

    public Request(String equipmentname, String brand, Double purchaseCost, Boolean working) {
        this.equipmentname = equipmentname;
        this.brand = brand;
        this.purchaseCost = purchaseCost;
        this.working = working;
    }

    public String getEquipmentname() {
        return equipmentname;
    }

    public void setEquipmentname(String equipmentname) {
        this.equipmentname = equipmentname;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Double getPurchaseCost() {
        return purchaseCost;
    }

    public void setPurchaseCost(Double purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public Boolean getWorking() {
        return working;
    }

    public void setWorking(Boolean working) {
        this.working = working;
    }

    @Override
    public String toString() {
        return "Request [equipmentname=" + equipmentname + ", brand=" + brand 
                + ", purchaseCost=" + purchaseCost + ", working=" + working + "]";
    }
}
