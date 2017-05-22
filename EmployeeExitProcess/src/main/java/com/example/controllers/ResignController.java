package com.example.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.EmployeeEntity;
import com.example.entities.ResignEntity;
import com.example.repositories.EmployeeRepository;
import com.example.repositories.ResignRepository;
import com.example.services.EmployeeService;
import com.example.services.ResignService;

@RestController
public class ResignController {
	@Autowired
	EmployeeService empServ;
	@Autowired
	EmployeeRepository empRep;
	@Autowired
	ResignRepository resignRep;
	@Autowired
	ResignService resignServ;
	
	// ***********************************************************************************************
	/*
	 * OPERATIONS AT /DASHBOARD
	 */
	@RequestMapping("refreshNotifications")
	public ResignEntity refreshNotifications(@RequestBody Long resignId){
		if(resignId == null || resignId == 0)
			return null;
		else
			return resignRep.findByResignationId(resignId);
	}

	// ***********************************************************************************************
	/* flag-confirmation-resignApplied guide
	 * 000 : initial condition, where employee is working safe and sound and hasn't applied for resignation
	 * 001 : resign applied
	 * 111 : rejected application
	 * 010 : application approved for processing by hr to accounts department --- acc : find by 010
	 * 011 : application verified by accounts and forwarded to infrastructure --- infra : find by 011
	 * 100 : application verified by infrastructure and forwarded to hr to relieve --- hr: find by 100
	 * 101 : employee relieved
	 * 110 : employee downloaded relieving letter, initiated account lock in t-2 days
	*/
	/*
	 * OPERATIONS AT /HR
	 */
	//Get all the employees who have applied for fresh resignation requests. // 001
	@RequestMapping("getPendingResignRequests")
	public List<EmployeeEntity> getPendingResignRequests(@RequestBody EmployeeEntity employee){
		/*checks*/
		EmployeeEntity emp = empRep.findByEmployeeId(employee.getEmployeeId());
		boolean flag = true;
		
		if(emp.getEmployeeId() != employee.getEmployeeId())
			flag = false;
		if(!(new String(emp.getDepartment()).equals("HR")))
			flag = false;
		if(!(new String(emp.getEmailAddress()).equals(employee.getEmailAddress())))
			flag = false;
		/*checks*/
		if(flag){
			List<EmployeeEntity> filter = new ArrayList<EmployeeEntity>();
			List<EmployeeEntity> data = new ArrayList<EmployeeEntity>();
			
			data = resignServ.getByFlagAndConfirmationAndResignApplied(false, false, true);
			
			for(EmployeeEntity ee : data){
				EmployeeEntity e = new EmployeeEntity();
				
				e.setEmployeeId(ee.getEmployeeId());
				e.setDateJoined(ee.getDateJoined());
				e.setDepartment(ee.getDepartment());
				e.setEmailAddress(ee.getEmailAddress());
				e.setEnabled(ee.getEnabled());
				e.setFirstName(ee.getFirstName());
				e.setHasAccessCard(ee.isHasAccessCard());
				e.setHasDocument(ee.isHasDocument());
				e.setHasLaptop(ee.isHasLaptop());
				e.setLastName(ee.getLastName());
				e.setMobile(ee.getMobile());
				e.setUserId(ee.getUserId());
				e.setPassWord(ee.getPassWord());
				e.setResignEmployeeId(ee.getResignEmployeeId());
				
				filter.add(e);
			}
			
			return filter;
		}
		return null;
	}
	//Get all the employees with verified requests. // 100
	@RequestMapping("verifiedEmployee")
	public List<EmployeeEntity> verifiedEmployee(@RequestBody EmployeeEntity employee){
		/*checks*/
		EmployeeEntity emp = empRep.findByEmployeeId(employee.getEmployeeId());
		boolean flag = true;
		
		if(emp.getEmployeeId() != employee.getEmployeeId())
			flag = false;
		if(!(new String(emp.getDepartment()).equals("HR")))
			flag = false;
		if(!(new String(emp.getEmailAddress()).equals(employee.getEmailAddress())))
			flag = false;
		/*checks*/
		if(flag){
			List<EmployeeEntity> filter = new ArrayList<EmployeeEntity>();
			List<EmployeeEntity> data = new ArrayList<EmployeeEntity>();
			
			data = resignServ.getByFlagAndConfirmationAndResignApplied(true, false, false);
			
			for(EmployeeEntity ee : data){
				EmployeeEntity e = new EmployeeEntity();
				
				e.setEmployeeId(ee.getEmployeeId());
				e.setDateJoined(ee.getDateJoined());
				e.setDepartment(ee.getDepartment());
				e.setEmailAddress(ee.getEmailAddress());
				e.setEnabled(ee.getEnabled());
				e.setFirstName(ee.getFirstName());
				e.setHasAccessCard(ee.isHasAccessCard());
				e.setHasDocument(ee.isHasDocument());
				e.setHasLaptop(ee.isHasLaptop());
				e.setLastName(ee.getLastName());
				e.setMobile(ee.getMobile());
				e.setUserId(ee.getUserId());
				e.setPassWord(ee.getPassWord());
				e.setResignEmployeeId(ee.getResignEmployeeId());
				
				filter.add(e);
			}
			
			return filter;
		}
		
		return null;
	}
	
	// ***********************************************************************************************
	/*
	 * OPERATOINS AT /ACC
	 */
	@RequestMapping("approved") // 010
	public List<EmployeeEntity> getEmployeesWithApprovedResignation(@RequestBody EmployeeEntity employee){
		/*checks*/
		EmployeeEntity emp = empRep.findByEmployeeId(employee.getEmployeeId());
		boolean flag = true;
		
		if(emp.getEmployeeId() != employee.getEmployeeId())
			flag = false;
		if(!(new String(emp.getDepartment()).equals("Accounts")))
			flag = false;
		if(!(new String(emp.getEmailAddress()).equals(employee.getEmailAddress())))
			flag = false;
		/*checks*/
		if(flag){
			List<EmployeeEntity> filter = new ArrayList<EmployeeEntity>();
			List<EmployeeEntity> data = new ArrayList<EmployeeEntity>();
			
			data = resignServ.getByFlagAndConfirmationAndResignApplied(false, true, false);
			
			for(EmployeeEntity ee : data){
				EmployeeEntity e = new EmployeeEntity();
				
				e.setEmployeeId(ee.getEmployeeId());
				e.setDateJoined(ee.getDateJoined());
				e.setDepartment(ee.getDepartment());
				e.setEmailAddress(ee.getEmailAddress());
				e.setEnabled(ee.getEnabled());
				e.setFirstName(ee.getFirstName());
				e.setHasAccessCard(ee.isHasAccessCard());
				e.setHasDocument(ee.isHasDocument());
				e.setHasLaptop(ee.isHasLaptop());
				e.setLastName(ee.getLastName());
				e.setMobile(ee.getMobile());
				e.setUserId(ee.getUserId());
				e.setPassWord(ee.getPassWord());
				e.setResignEmployeeId(ee.getResignEmployeeId());
				
				filter.add(e);
			}
			
			return filter;
		}
		
		return null;
	}

	// ***********************************************************************************************
	/*
	 * OERATIONS AT /INFRA
	 */
	@RequestMapping("pendingAtInfra") // 011
	public List<EmployeeEntity> getPendingEmployeeAtInfra(@RequestBody EmployeeEntity employee){
		/*checks*/
		EmployeeEntity emp = empRep.findByEmployeeId(employee.getEmployeeId());
		boolean flag = true;
		
		if(emp.getEmployeeId() != employee.getEmployeeId())
			flag = false;
		if(!(new String(emp.getDepartment()).equals("Infrastructure")))
			flag = false;
		if(!(new String(emp.getEmailAddress()).equals(employee.getEmailAddress())))
			flag = false;
		/*checks*/
		if(flag){
			List<EmployeeEntity> filter = new ArrayList<EmployeeEntity>();
			List<EmployeeEntity> data = new ArrayList<EmployeeEntity>();
			
			data = resignServ.getByFlagAndConfirmationAndResignApplied(false, true, true);
			
			for(EmployeeEntity ee : data){
				EmployeeEntity e = new EmployeeEntity();
				
				e.setEmployeeId(ee.getEmployeeId());
				e.setDateJoined(ee.getDateJoined());
				e.setDepartment(ee.getDepartment());
				e.setEmailAddress(ee.getEmailAddress());
				e.setEnabled(ee.getEnabled());
				e.setFirstName(ee.getFirstName());
				e.setHasAccessCard(ee.isHasAccessCard());
				e.setHasDocument(ee.isHasDocument());
				e.setHasLaptop(ee.isHasLaptop());
				e.setLastName(ee.getLastName());
				e.setMobile(ee.getMobile());
				e.setUserId(ee.getUserId());
				e.setPassWord(ee.getPassWord());
				e.setResignEmployeeId(ee.getResignEmployeeId());
				
				filter.add(e);
			}
			
			return filter;
		}

		return null;
	}
}
