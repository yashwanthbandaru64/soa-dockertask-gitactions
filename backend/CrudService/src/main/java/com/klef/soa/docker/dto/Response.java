package com.klef.soa.docker.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response DTO containing gym equipment details")
public class Response {

    @Schema(description = "Auto-generated unique equipment ID", example = "1")
    private Long id;

    @Schema(description = "Name of the gym equipment", example = "Treadmill")
    private String equipmentname;

    @Schema(description = "Brand of the gym equipment", example = "LifeFitness")
    private String brand;

    @Schema(description = "Purchase cost", example = "45000.00")
    private Double purchaseCost;

    @Schema(description = "Working condition status", example = "true")
    private Boolean working;

    public Response() {
    }

    public Response(Long id, String equipmentname, String brand, Double purchaseCost, Boolean working) {
        this.id = id;
        this.equipmentname = equipmentname;
        this.brand = brand;
        this.purchaseCost = purchaseCost;
        this.working = working;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return "Response [id=" + id + ", equipmentname=" + equipmentname 
                + ", brand=" + brand + ", purchaseCost=" + purchaseCost + ", working=" + working + "]";
    }
}
