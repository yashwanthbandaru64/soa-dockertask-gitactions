package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gym_table")
public class GymEquipment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String equipmentname;
	@Column(nullable = false)
	private String brand;
	@Column(nullable = false)
	private Double purchaseCost;
	@Column(nullable = false)
	private Boolean working;
	
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
		return "GymEquipment [id=" + id + ", equipmentname=" + equipmentname + ", brand=" + brand + ", purchaseCost="
				+ purchaseCost + ", working=" + working + "]";
	}
	
	

}
