package com.example.entities;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

//this class acts as model for MVC pattern basically what will be the structure of database
@Entity
@Table(name = "employee")
public class EmployeeEntity implements Serializable, UserDetails { //GrantedAuthority and UserDetails
	
	//************************************************Columns in EmployeeTable***************************************************
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "employee_id")
	private long employeeId;

	@Column(name = "user_id")
	private String userId;

	@Column(name = "pass_word")
	private String passWord;
	
	@Column(name = "email_address")
	private String emailAddress;
	
	@Column(name = "first_name")
	private String firstName;
	
	@Column(name = "last_name")
	private String lastName;
	
	@Column(name = "mobile")
	private String mobile;
	
	@Column(name = "date_joined")
	private Date dateJoined;
	
	@Column(name = "department")
	private String department;
	
	@Column(name = "has_access_card")
	private boolean hasAccessCard;
	
	@Column(name = "has_document")
	private boolean hasDocument;
	
	@Column(name = "has_laptop")
	private boolean hasLaptop;
	
	@Column(name = "enabled")
	public boolean enabled;

	//MAPPING******************************************************************************
	//mapping to tables Resignation, Roles, Notifications goes here
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name = "resign_employee_id", referencedColumnName = "resignation_id")
	private ResignEntity resignEmployeeId;
	
	public ResignEntity getResignEmployeeId() {
		return resignEmployeeId;
	}

	public void setResignEmployeeId(ResignEntity resignEmployeeId) {
		this.resignEmployeeId = resignEmployeeId;
	}

	@OneToMany(mappedBy = "roleEmployeeId", fetch = FetchType.EAGER, cascade=CascadeType.ALL)
	private List<RolesEntity> roleEmployeeId;

	public List<RolesEntity> getRoleEmployeeId() {
		return roleEmployeeId;
	}

	public void setRoleEmployeeId(List<RolesEntity> roleEmployeeId) {
		this.roleEmployeeId = roleEmployeeId;
	}

	//MAPPING******************************************************************************

	//************************************************Getters and Setters********************************************************
	//getters and setters
	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPassWord() {
		return passWord;
	}

	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public Date getDateJoined() {
		return dateJoined;
	}

	public void setDateJoined(Date dateJoined) {
		this.dateJoined = dateJoined;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public boolean isHasAccessCard() {
		return hasAccessCard;
	}

	public void setHasAccessCard(boolean hasAccessCard) {
		this.hasAccessCard = hasAccessCard;
	}

	public boolean isHasDocument() {
		return hasDocument;
	}

	public void setHasDocument(boolean hasDocument) {
		this.hasDocument = hasDocument;
	}

	public boolean isHasLaptop() {
		return hasLaptop;
	}

	public void setHasLaptop(boolean hasLaptop) {
		this.hasLaptop = hasLaptop;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	public boolean getEnabled(){
		return enabled;
	}

	//USER DETAILS IMPLEMENTED METHODS
	

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roleEmployeeId;
	}

	@Override
	public String getPassword() {
		return passWord;
	}

	@Override
	public String getUsername() {
		return userId;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}
