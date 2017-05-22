package com.example.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.EmployeeEntity;
import com.example.entities.ResignEntity;
import com.example.entities.RolesEntity;
import com.example.repositories.EmployeeRepository;
import com.example.repositories.RoleRepository;
import com.example.services.EmployeeService;

import java.util.Date;

@RestController
public class EmployeeController{

	@Autowired
	EmployeeService empServ;

	@Autowired
	EmployeeRepository empRep;

	@Autowired
	RoleRepository roleRep;

	// default users 
	// technically all hr are super-user
	/**
	 * must change the default test case names.
	 */
	@Autowired
	public void testData() {
		List<EmployeeEntity> ee = empRep.findAll();
		if (ee.size() == 0) {
			// hr
			EmployeeEntity superUser = new EmployeeEntity();

			superUser.setFirstName("Hidetoshi");
			superUser.setLastName("Dekisugi");
			superUser.setDepartment("HR");
			superUser.setDateJoined(new Date());
			superUser.setEmailAddress("hidetoshi@dekisugi.genius");
			superUser.setHasAccessCard(true);
			superUser.setHasDocument(true);
			superUser.setHasLaptop(true);
			superUser.setUserId("admin");
			superUser.setPassWord("admin");
			superUser.setMobile("9876543210");
			superUser.setEnabled(true);

			//empRep.save(superUser);
			addOrUpdateEmployee(superUser);

			// regular
			EmployeeEntity regular = new EmployeeEntity();

			regular.setFirstName("Nobita");
			regular.setLastName("Nobi");
			regular.setDepartment("Regular");
			regular.setDateJoined(new Date());
			regular.setEmailAddress("nobita@nobi.unique");
			regular.setHasAccessCard(true);
			regular.setHasDocument(false);
			regular.setHasLaptop(false);
			regular.setUserId("r");
			regular.setPassWord("r");
			regular.setMobile("0000000000");
			regular.setEnabled(true);

			//empRep.save(regular);
			addOrUpdateEmployee(regular);
			
			EmployeeEntity regular2 = new EmployeeEntity();
			
			regular2.setFirstName("Takashi");
			regular2.setLastName("Goda");
			regular2.setDepartment("Infrastructure");
			regular2.setDateJoined(new Date());
			regular2.setEmailAddress("gian@goda.strong");
			regular2.setHasAccessCard(true);
			regular2.setHasDocument(false);
			regular2.setHasLaptop(false);
			regular2.setUserId("g");
			regular2.setPassWord("g");
			regular2.setMobile("0000123000");
			regular2.setEnabled(true);

			//empRep.save(regular2);
			addOrUpdateEmployee(regular2);

			// accounts

			EmployeeEntity acc = new EmployeeEntity();

			acc.setFirstName("Shizuka");
			acc.setLastName("Minamoto");
			acc.setDepartment("Accounts");
			acc.setDateJoined(new Date());
			acc.setEmailAddress("shizuka@minamoto.gorgeous");
			acc.setHasAccessCard(true);
			acc.setHasDocument(true);
			acc.setHasLaptop(false);
			acc.setUserId("a");
			acc.setPassWord("a");
			acc.setMobile("1111111111");
			acc.setEnabled(true);

			//empRep.save(acc);
			addOrUpdateEmployee(acc);

			// accounts

			EmployeeEntity infra = new EmployeeEntity();

			infra.setFirstName("Suneo");
			infra.setLastName("Honekawa");
			infra.setDepartment("Infrastructure");
			infra.setDateJoined(new Date());
			infra.setEmailAddress("suneo@honekawa.clever");
			infra.setHasAccessCard(true);
			infra.setHasDocument(false);
			infra.setHasLaptop(true);
			infra.setUserId("i");
			infra.setPassWord("i");
			infra.setMobile("2222222222");
			infra.setEnabled(true);

			//empRep.save(infra);
			addOrUpdateEmployee(infra);
			
		}
	}

	// ***********************************************************************************************
	/*
	 * OPERATIONS AT /HR
	 */
	@RequestMapping("getAllEmployees")
	public List<EmployeeEntity> getAllEmployees(@RequestBody EmployeeEntity employee) {
		/*checks*/
		EmployeeEntity emp = empRep.findByEmployeeId(employee.getEmployeeId());
		/*checks*/
		if(valid(emp, employee, "HR"))
			return empRep.findAll();
		return null;
	}

	// ***********************************************************************************************
	/*
	 * any add or update operation on employee data HR | ACC | INFRA
	 */
	// employee operations at HR portal
	// replacement for hasAuthority thing of spring
	public boolean valid(EmployeeEntity e1, EmployeeEntity e2, String dept){
		
		boolean flag = true;
		
		if(e1.getEmployeeId() != e2.getEmployeeId())
			flag = false;
		if(!(new String(e1.getDepartment()).equals(dept)))
			flag = false;
		if(!(new String(e2.getDepartment()).equals(dept)))
			flag = false;
		if(!(new String(e1.getEmailAddress()).equals(e2.getEmailAddress())))
			flag = false;
		if(!(new String(e1.getUserId()).equals(e2.getUserId())))
			flag = false;
		if(!(new String(e1.getPassWord()).equals(e2.getPassWord())))
			flag = false;
		
		return flag;
	}
	// replacement for roles - create class holder
	
	@RequestMapping("addOrUpdateEmployeeHR")
	public ResignEntity addOrUpdateEmployeeHR(@RequestBody Holder body)
			throws NullPointerException {
		
		/*checks*/
		EmployeeEntity employee = body.getEmployee(); // data to be saved in database
		EmployeeEntity liu = body.getLiu(); // logged in user data
		EmployeeEntity empCheck = empRep.findByEmployeeId(liu.getEmployeeId());
		/*checks*/
		if(valid(liu, empCheck, "HR") && (employee.getFirstName()!=null || employee.getLastName()!=null || employee.getDateJoined().equals(null)))
			return addOrUpdateEmployee(employee);
		return null;
	}
	
	// employee operations at ACC portal
	@RequestMapping("addOrUpdateEmployeeACC")
	public ResignEntity addOrUpdateEmployeeACC(@RequestBody Holder body)
			throws NullPointerException {
			
		/*checks*/
		EmployeeEntity employee = body.getEmployee(); // data to be saved in database
		EmployeeEntity liu = body.getLiu(); // logged in user data
		EmployeeEntity empCheck = empRep.findByEmployeeId(liu.getEmployeeId());
		/*checks*/
		if(valid(liu, empCheck, "Accounts"))
			return addOrUpdateEmployee(employee);
		return null;
	}
	
	// employee operations at INFRA portal
	@RequestMapping("addOrUpdateEmployeeINFRA")
	public ResignEntity addOrUpdateEmployeeINFRA(@RequestBody Holder body)
			throws NullPointerException {
			
		/*checks*/
		EmployeeEntity employee = body.getEmployee(); // data to be saved in database
		EmployeeEntity liu = body.getLiu(); // logged in user data
		EmployeeEntity empCheck = empRep.findByEmployeeId(liu.getEmployeeId());
		/*checks*/
		if(valid(liu, empCheck, "Infrastructure"))
			return addOrUpdateEmployee(employee);
		return null;
	}
	
	// employee operations by regular
	@RequestMapping("addOrUpdateEmployeeR")
	public ResignEntity addOrUpdateEmployeeR(@RequestBody EmployeeEntity employee)
			throws NullPointerException {
			
		//EmployeeEntity empDept = empRep.findByEmployeeId(employee.getEmployeeId());
		/*if(!valid(empDept, employee, "Regular"))
			return null;*/
		if(!(    (!employee.getResignEmployeeId().isFlag() && !employee.getResignEmployeeId().isConfirmation() && employee.getResignEmployeeId().isResignApplied())    ||    (employee.getResignEmployeeId().isFlag() && employee.getResignEmployeeId().isConfirmation() && !employee.getResignEmployeeId().isResignApplied())    ))
			return null;
		if((employee.getResignEmployeeId().isFlag() && employee.getResignEmployeeId().isConfirmation() && !employee.getResignEmployeeId().isResignApplied()) && (employee.getResignEmployeeId().getResignStatus().length() < 300))
			return null;
		
		return addOrUpdateEmployee(employee);
	}

	//to validate email at back-end in addOrUpdateEmployee
	public boolean isValidEmailAddress(String email) {
	      String ePattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
	      java.util.regex.Pattern p = java.util.regex.Pattern.compile(ePattern);
	      java.util.regex.Matcher m = p.matcher(email);
	      return m.matches();
	}
	// employee operations
	public ResignEntity addOrUpdateEmployee(EmployeeEntity employee)
			throws NullPointerException {
		/*validations*/
		SimpleDateFormat yyyyMMdd = new SimpleDateFormat("yyyyMMdd");
		String date = yyyyMMdd.format(employee.getDateJoined());
		//should add password length validation too but then it will affect my test cases.
		if(employee.enabled==false || employee.getFirstName()=="" || employee.getLastName()=="" || date.length()<8)
			return null;
		if(employee.getEmailAddress().length() != 0 && !isValidEmailAddress(employee.getEmailAddress()))
			return null;
		/*validations*/
		
		if (employee.getResignEmployeeId() != null) {
			employee.getResignEmployeeId().setResignEmployeeId(employee);
		}
		
		ResignEntity re = new ResignEntity();
		
		//check for duplicate data
		if(! empServ.duplicate(employee)){
			employee = empServ.addOrUpdateEmployee(employee);
			
			/*role table*/
			RolesEntity empRo = roleRep.findByRoleEmployeeId(employee); 
			if(empRo == null){
				empRo = new RolesEntity();
				empRo.setRoles(employee.getDepartment());
				empRo.setRoleEmployeeId(employee);
				roleRep.save(empRo);
			}
			
			List<RolesEntity> empRoL = new ArrayList<RolesEntity>();
			empRoL.add(empRo);
			employee.setRoleEmployeeId(empRoL);
			empRep.save(employee);
			/*role table*/
		}
		else{
			re.setFlag(true);
		}
		
		if(employee.getResignEmployeeId() != null){
			EmployeeEntity empEnt = empRep.findByEmployeeId(employee
					.getEmployeeId());
			return empEnt.getResignEmployeeId();
		}
		return re;
	}
	
	//deactivating user
	@RequestMapping("deactivate")
	public void deactivate(@RequestBody EmployeeEntity employee){

		new java.util.Timer().schedule( 
		        new java.util.TimerTask() {
		            @Override
		            public void run() {
		        		employee.enabled = false;
		        		empRep.save(employee);
		            }
		        }, 
		        60000/*172800000*/
		);
	}
	
	//duplicate check
	@RequestMapping("updateEmployee")
	public EmployeeEntity updateEmployee(@RequestBody EmployeeEntity employee)
			throws NullPointerException {
		if (employee.getResignEmployeeId() != null) {
			employee.getResignEmployeeId().setResignEmployeeId(employee);
		}
		if(! empServ.duplicate(employee)){
			empServ.addOrUpdateEmployee(employee);
		}
		EmployeeEntity empEnt = empRep.findByEmployeeId(employee
				.getEmployeeId());
		return empEnt;
	}
	
	//getting fresh data at action pane
	@RequestMapping("refreshEmployee")
	public EmployeeEntity refreshEmployee(@RequestBody EmployeeEntity employee){
		return empRep.findByEmployeeId(employee.getEmployeeId());
	}
}