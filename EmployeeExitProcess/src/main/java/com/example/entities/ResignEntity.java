package com.example.entities;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "resignation")
public class ResignEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "resignation_id")
	private long resignationId;

	//flag to separate departments to self attest
	@Column(name = "flag")
	private boolean flag;
	
	@Column(name = "resign_applied")
	private boolean resignApplied;

	@Column(name = "resign_applied_date")
	private Date resignAppliedDate;

	@Column(name = "resign_status", length = 5000)
	private String resignStatus;

	@Column(name = "relieved_date")
	private Date relievedDate;
	
	//set at /acc
	
	@Column(name = "arrears")
	private long arrears;

	//flag manipulation
	@Column(name = "confirmation")
	private boolean confirmation;

	//MAPPING******************************************************************************
	
	@JsonIgnore
	@OneToOne(mappedBy = "resignEmployeeId")
	private EmployeeEntity resignEmployeeId;
	
	public EmployeeEntity getResignEmployeeId() {
		return resignEmployeeId;
	}

	public void setResignEmployeeId(EmployeeEntity resignEmployeeId) {
		this.resignEmployeeId = resignEmployeeId;
	}
	//MAPPING******************************************************************************
	
	//getters and setters
	public long getResignationId() {
		return resignationId;
	}

	public void setResignationId(long resignationId) {
		this.resignationId = resignationId;
	}

	public boolean isResignApplied() {
		return resignApplied;
	}

	public void setResignApplied(boolean resignApplied) {
		this.resignApplied = resignApplied;
	}

	public Date getResignAppliedDate() {
		return resignAppliedDate;
	}

	public void setResignAppliedDate(Date resignAppliedDate) {
		this.resignAppliedDate = resignAppliedDate;
	}

	public String getResignStatus() {
		return resignStatus;
	}

	public void setResignStatus(String resignStatus) {
		this.resignStatus = resignStatus;
	}

	public Date getRelievedDate() {
		return relievedDate;
	}

	public void setRelievedDate(Date relievedDate) {
		this.relievedDate = relievedDate;
	}

	public long getArrears() {
		return arrears;
	}

	public void setArrears(long arrears) {
		this.arrears = arrears;
	}

	public boolean isConfirmation() {
		return confirmation;
	}

	public void setConfirmation(boolean confirmation) {
		this.confirmation = confirmation;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public boolean isFlag() {
		return flag;
	}

	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	
	
	
	
}
