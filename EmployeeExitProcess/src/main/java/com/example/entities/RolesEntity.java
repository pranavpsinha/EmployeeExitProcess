package com.example.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "roles")
public class RolesEntity implements GrantedAuthority{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "roles_id")
	private long rolesId;
	
	@Column(name = "roles")
	private String roles;
	
	//MAPPING******************************************************************************
	@JsonIgnore
	@ManyToOne()
	@JoinColumn(name = "role_employee_id", referencedColumnName = "employee_id")
	private EmployeeEntity roleEmployeeId;
	
	public EmployeeEntity getRoleEmployeeId() {
		return roleEmployeeId;
	}

	public void setRoleEmployeeId(EmployeeEntity roleEmployeeId) {
		this.roleEmployeeId = roleEmployeeId;
	}
	//MAPPING******************************************************************************

	//getters and setters
	public long getRolesId() {
		return rolesId;
	}
	
	public void setRolesId(long rolesId) {
		this.rolesId = rolesId;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	//GRANTEDAUTHORITY METHODS
	
	@Override
	public String getAuthority() {
		return roles;
	}
	
}
