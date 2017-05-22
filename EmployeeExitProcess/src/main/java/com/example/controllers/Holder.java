package com.example.controllers;

import com.example.entities.EmployeeEntity;

public class Holder {

	private EmployeeEntity employee;
	private EmployeeEntity liu;
	
	public EmployeeEntity getEmployee(){
		return employee;
	}
	public void setEmployee(EmployeeEntity e){
		this.employee = e;
	}
	public EmployeeEntity getLiu(){
		return liu;
	}
	public void setLiu(EmployeeEntity e){
		this.liu = e;
	}
	
}
