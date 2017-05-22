package com.example.securityConfiguration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.entities.EmployeeEntity;

@RestController
public class SecurityController {

	@Autowired
	SecurityService securityServ;
	
	// 6
	@RequestMapping("public/login")
	public EmployeeEntity getLoggedInEmployee(){
		if(securityServ.getLoggedInEmployee().getEnabled())
			return securityServ.getLoggedInEmployee();
		return null;
	}
	
}
