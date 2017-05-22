package com.example.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.entities.EmployeeEntity;
import com.example.entities.ResignEntity;
import com.example.repositories.EmployeeRepository;
import com.example.repositories.ResignRepository;

@Service
public class ResignService {
	@Autowired
	EmployeeRepository empRep;
	@Autowired
	ResignRepository resignRep;
	
	//hr approve:01 verified: 00 | acc 10 | infra 11
	public List<EmployeeEntity> getByFlagAndConfirmationAndResignApplied(boolean f, boolean c, boolean ra) {
		List<ResignEntity> tempResignData = resignRep.findByFlagAndConfirmationAndResignApplied(f, c, ra);
		List<EmployeeEntity> tempEmployeeData = new ArrayList<EmployeeEntity>();
		
		for(ResignEntity ted: tempResignData){
			long tempEmployeeId = ted.getResignEmployeeId().getEmployeeId();
			EmployeeEntity e = empRep.findByEmployeeId(tempEmployeeId);
			tempEmployeeData.add(e);
			System.out.println(ted);
		}
		
		return tempEmployeeData;
	}

}
