package com.example.securityConfiguration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.entities.EmployeeEntity;
import com.example.repositories.EmployeeRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	@Autowired
	EmployeeRepository empRep;

	// 5 just when i press login button
	@Override
	public EmployeeEntity loadUserByUsername(String username) throws UsernameNotFoundException {
		EmployeeEntity emp = empRep.findByUserId(username);
		if(emp == null){
			throw new UsernameNotFoundException("User trapped in singularity");
		}
		return emp;
	}
	
}
