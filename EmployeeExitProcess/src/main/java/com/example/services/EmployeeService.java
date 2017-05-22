package com.example.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.entities.EmployeeEntity;
import com.example.repositories.EmployeeRepository;
import com.example.repositories.ResignRepository;
import com.example.repositories.RoleRepository;

@Service
public class EmployeeService {

	@Autowired
	EmployeeRepository empRep;
	@Autowired
	ResignRepository resignRep;
	@Autowired
	RoleRepository roleRep;

	// @hr
	public EmployeeEntity addOrUpdateEmployee(EmployeeEntity employee) {
		return empRep.save(employee);
	}

	public boolean duplicate(EmployeeEntity employee) {
		//clear rejection
		if(employee.getEmailAddress() != "" && empRep.findByEmailAddress(employee.getEmailAddress()).size() > 1){
			return true;
		}
		if(employee.getMobile() != "" && empRep.findByMobile(employee.getMobile()).size() > 1){
			return  true;
		}
		//spoofing of single other person
		if(employee.getEmailAddress() != "" && empRep.findByEmailAddress(employee.getEmailAddress()).size() == 1){
			for(EmployeeEntity e : empRep.findByEmailAddress(employee.getEmailAddress())){
				if(!(e.getEmployeeId() == employee.getEmployeeId())){
					return true;
				}
			}
		}
		if(employee.getMobile() != "" && empRep.findByMobile(employee.getMobile()).size() == 1){
			for(EmployeeEntity e : empRep.findByMobile(employee.getMobile())){
				if(!(e.getEmployeeId() == employee.getEmployeeId())){
					return true;
				}
			}
		}

		return false;
	}

}
