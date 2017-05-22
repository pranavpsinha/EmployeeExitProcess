package com.example.securityConfiguration;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.entities.EmployeeEntity;

@Service
public class SecurityService {

	// 7
	public EmployeeEntity getLoggedInEmployee(){
		EmployeeEntity emp = (EmployeeEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return emp;
	}
	
}
