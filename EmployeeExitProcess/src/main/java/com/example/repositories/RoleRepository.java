package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entities.EmployeeEntity;
import com.example.entities.RolesEntity;

@Repository
public interface RoleRepository extends JpaRepository<RolesEntity, Long>{

	RolesEntity findByRoleEmployeeId(EmployeeEntity employee); 

}
