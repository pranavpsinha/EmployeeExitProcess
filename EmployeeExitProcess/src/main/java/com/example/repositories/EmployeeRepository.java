package com.example.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entities.EmployeeEntity;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long>{

	public EmployeeEntity findByEmployeeId(long l);
	public EmployeeEntity findByUserId(String username);
	public List<EmployeeEntity> findByEmailAddress(String emailAddress);
	public List<EmployeeEntity> findByMobile(String mobile); 
	
}