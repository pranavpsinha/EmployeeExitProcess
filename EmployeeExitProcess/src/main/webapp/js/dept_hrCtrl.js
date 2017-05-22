/**
 * @Author : Pranav Sinha
 * 
 * @controller: hrCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.employee
 * 			• employee object for new employee at add-new-employee form.
 * 		2.	$scope.instructionF, $scope.addF, $scope.pendingF, $scope.verifiedF
 * 			• to give illusion of switching a template at hr portal.
 * 			• navigates between instructions, add-employee, view-pending-resignation-requests, view-verified-resignation-requests.
 * 			• interacts with $scope.instructions(), $scope.add(), $scope.pending(), $scope.verified.
 *		
 * 		
 * 
 * @functions:
 * 		1.	$scope.back()
 * 			• like all the other department-specific-portals, gets triggered on go-back-button to go back to central dashboard screen.
 * 		2.	$scope.instructions(), $scope.add(), $scope.pending(), $scope.verified
 * 			• simple illusion of switching templates
 * 			• uses : $scope.instructionF, $scope.addF, $scope.pendingF, $scope.verifiedF
 * 		3.	$scope.updateButtonFlag()
 * 			• returns true if any response has been selected by hr for any resign-request. false otherwise.
 * 		4.	$scope.modalData()
 * 			• to access modal data irrespective of ng-repeat division.
 * 		5.	$scope.newPassword() ↔ $scope.generatePassword()
 * 			• newPassword() uses generatePassword() to create a completely random arbitrary password for new user in add-new-employee @hr
 * 		6.	$scope.sendData()
 * 			• if form-details at add-new-employee form is valid, then pings "addOrUpdateEmployee" request-mapping-url (here to create new user).
 * 			• also, has a double check for validity of entered data.
 * 			• has a feedback mechanism so that no redundant data is supplied to database under any circumstances.
 * 		7.	$scope.getData()
 * 			• to retrieve list of all employees who have applied for resignation.
 * 		8.	$scope.postBack()
 * 			• to respond to all the pending resignation requests.
 * 			• hr is expected to respond in acceptance, rejection or scheduling of meeting.
 * 		9.	$scope.getVerifiedEmployeeData()
 * 			• to retrieve list of all employees who have verified resignation requests and await relieve.
 * 	   10.	$scope.relieve()
 * 			• finally relieve employee so that employee shall download relieving-letter.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 		
 */

//HR Controller
app.controller("hrCtrl", function($rootScope, $scope, $location, loginService, $http, $filter, $timeout, $state){
	
	/**
	 * temporarily pause notification refresh when not on notifications page
	 */
	clearInterval($rootScope.periodicNotificationsC);
	clearInterval($rootScope.periodicNotificationsHR1); //pending resign requests
	clearInterval($rootScope.periodicNotificationsHR2); //verified resign requests
	clearInterval($rootScope.periodicNotificationsACC);
	clearInterval($rootScope.periodicNotificationsINFRA);
	
	/**
	 * additional secondary security check in case some over-smart user finds way to this controller.
	 */
	if(loginService.getUser() == null || loginService.getUser().department != "HR"){
		console.log("overSmart!");
		loginService.flush();
		$http.get("/logout");
		$location.url("/login");
	}

	/**
	 * 	$scope.back()
	 * 		• like all the other department-specific-portals, gets triggered on go-back-button to go back to central dashboard screen.
	 */
	
	/**
	 * Start	:	Template Switching Illusion
	 * @variables
	 * $scope.instructionF, $scope.addF, $scope.pendingF, $scope.verifiedF
	 * 		• to give illusion of switching a template at hr portal.
	 * 		• navigates between instructions, add-employee, view-pending-resignation-requests, view-verified-resignation-requests
	 * @functions
	 * $scope.instructions(), $scope.add(), $scope.pending(), $scope.verified
	 * 		• simple illusion of switching templates
	 * 		• uses : $scope.instructionF, $scope.addF, $scope.pendingF, $scope.verifiedF
	 */
	
	$scope.back = function(){
		restore();
		$state.go("dashboard");
	}
	// hr portal flags
	$scope.instructionF = (sessionStorage.getItem("instructionF")=='1') ? true : false;
	$scope.addF = (sessionStorage.getItem("addF")=='1') ? true : false;
	$scope.pendingF = (sessionStorage.getItem("pendingF")=='1') ? true : false;
	$scope.verifiedF = (sessionStorage.getItem("verifiedF")=='1') ? true : false;

	// hr portal flags
	$scope.instructions = function(){
		$scope.instructionF = false;
		$scope.addF = true;
		$scope.pendingF = true;
		$scope.verifiedF = true;
		//session storage
		sessionStorage.setItem("instructionF", "0");
		sessionStorage.setItem("addF", "1");
		sessionStorage.setItem("pendingF", "1");
		sessionStorage.setItem("verifiedF", "1");
		//text-decoration
		document.getElementById("add").style.textDecoration = "none";
		document.getElementById("rr").style.textDecoration = "none";
		document.getElementById("vr").style.textDecoration = "none";
	}
	$scope.add = function(){
		$scope.instructionF = true;
		$scope.addF = false;
		$scope.pendingF = true;
		$scope.verifiedF = true;
		//session storage
		sessionStorage.setItem("instructionF", "1");
		sessionStorage.setItem("addF", "0");
		sessionStorage.setItem("pendingF", "1");
		sessionStorage.setItem("verifiedF", "1");
		//text-decoration
		document.getElementById("add").style.textDecoration = "underline";
		document.getElementById("rr").style.textDecoration = "none";
		document.getElementById("vr").style.textDecoration = "none";
	}
	$scope.pending = function(){
		$scope.instructionF = true;
		$scope.addF = true;
		$scope.pendingF = false;
		$scope.verifiedF = true;
		//session storage
		sessionStorage.setItem("instructionF", "1");
		sessionStorage.setItem("addF", "1");
		sessionStorage.setItem("pendingF", "0");
		sessionStorage.setItem("verifiedF", "1");
		//text-decoration
		document.getElementById("add").style.textDecoration = "none";
		document.getElementById("rr").style.textDecoration = "underline";
		document.getElementById("vr").style.textDecoration = "none";
	}
	$scope.verified = function(){
		$scope.instructionF = true;
		$scope.addF = true;
		$scope.pendingF = true;
		$scope.verifiedF = false;
		//session storage
		sessionStorage.setItem("instructionF", "1");
		sessionStorage.setItem("addF", "1");
		sessionStorage.setItem("pendingF", "1");
		sessionStorage.setItem("verifiedF", "0");
		//text-decoration
		document.getElementById("add").style.textDecoration = "none";
		document.getElementById("rr").style.textDecoration = "none";
		document.getElementById("vr").style.textDecoration = "underline";
	}
	/**
	 * End	:	Template Switching Illusion
	 */
	//-----------------
	//preliminary constraint ends here
	
	
	$scope.employee = {
			"userId"			: 	"",
			"passWord"			: 	"",
			"firstName"			:	"",
			"lastName"			: 	"",
			"emailAddress"		: 	"",
			"mobile"			:	"",
			"department"		:	"",
			"dateJoined"		: 	"",
			"hasLaptop"			:	"",
			"hasAccessCard"		:	"",
			"hasDocument"		: 	"",
	};
	
	/**
	 * 	$scope.updateButtonFlag()
	 * 		• returns true if any response has been selected by hr for any resign-request. false otherwise.
	 */
	//update button flag
	$scope.updateButtonFlag = function(s){
		if(s=="Accept" || s=="Reject" || s=="Call For Meeting")
			return true;
		else
			return false;
	}
	
	/**
	 * 	$scope.modalData()
	 * 		• to access modal data irrespective of ng-repeat division.
	 */
	//modal data
	$scope.modalData = function(e){
		$scope.mData = e;
	}

	/**
	 * 	$scope.newPassword() ↔ $scope.generatePassword()
	 * 		• newPassword() uses generatePassword() to create a completely random arbitrary password for new user in add-new-employee @hr
	 */
	$scope.generatePassword = function(){
		var length = 5, charset = "ab1234cdefgh-{}ijklmnABCDopqrst@|*.uvwxyzEFG-{}HIJKLMNO@|*.PQRSTUVW-{}XYZ056789",
        retVal = "";
		for (var i = 0, n = charset.length; i < length; i++) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
    	}
    	return retVal;
	}
	/**
	 * 	$scope.newPassword() ↔ $scope.generatePassword()
	 * 		• newPassword() uses generatePassword() to create a completely random arbitrary password for new user in add-new-employee @hr
	 */
	$scope.newPassword = function(){
		$scope.employee.passWord = $scope.generatePassword();
	}
	$scope.unameTail = angular.lowercase($scope.generatePassword().substr(0,3));
	/**
	 * variables for validations and proper workflow
	 */
	$scope.dummyDate = "";
	$scope.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
	$scope.departments = ["Regular", "Accounts", "Infrastructure", "HR"];
	$scope.employee.department = $scope.departments[0];
	
	//ngOptions
	$scope.status = ["Accept", "Reject", "Call For Meeting"];

	$scope.employee.passWord = $scope.generatePassword();
	
	/**
	 * 	$scope.sendData()
	 * 		• if form-details at add-new-employee form is valid, then pings "addOrUpdateEmployee" request-mapping-url (here to create new user).
	 * 		• also, has a double check for validity of entered data.
	 * 		• has a feedback mechanism so that no redundant data is supplied to database under any circumstances.
	 */
	//sending data to database
	$scope.sendData = function(){
		//validation
		if($scope.dummyDate.length <= 10 || !($scope.employee.mobile.length==0 || $scope.employee.mobile.length==10) || !$scope.addEmployee.email.$valid || $scope.employee.firstName.length==0 || $scope.employee.lastName.length==0 || $scope.employee.department==''){
			if($scope.employee.firstName.length==0){
				document.getElementById("first_name").placeholder = "Mandatory Field";
				document.getElementById("first_name").className += " formInvalid";
				document.getElementById("first_name").focus();
			}
			else if($scope.employee.lastName.length==0){
				document.getElementById("last_name").placeholder = "Mandatory Field";
				document.getElementById("last_name").className += " formInvalid";
				document.getElementById("last_name").focus();
			}
			else if($scope.employee.department==''){
				document.getElementById("department").placeholder = "Mandatory Field";
				document.getElementById("department").className += " formInvalid";
				document.getElementById("department").focus();
			}
			else if($scope.dummyDate.length < 10){
				document.getElementById("doj").placeholder = "Mandatory Field";
				document.getElementById("doj").className += " formInvalid";
				document.getElementById("doj").focus();
			}
		}
		else{	
			$scope.employee.resignEmployeeId = null;
			$scope.employee.dateJoined = $filter('date')($scope.dummyDate,'yyyy-MM-dd');
			$scope.employee.userId = angular.lowercase($scope.employee.lastName.substr(0,3)+$scope.employee.firstName.substr(0,2)+$scope.unameTail);
			$scope.unameTail = angular.lowercase($scope.generatePassword().substr(0,3));
			$scope.employee.firstName = $scope.employee.firstName.charAt(0).toUpperCase() + $scope.employee.firstName.substr(1,$scope.employee.firstName.length).toLowerCase();
			$scope.employee.lastName = $scope.employee.lastName.charAt(0).toUpperCase() + $scope.employee.lastName.substr(1,$scope.employee.lastName.length).toLowerCase();
			$scope.employee.enabled = true;
			
			$scope.holder = {};
			$scope.holder.employee = $scope.employee;
			$scope.holder.liu = loginService.getUser();
			
			$http.post("addOrUpdateEmployeeHR", $scope.holder).success(function(f){
				if(typeof(f)=="string"){
					$scope.employee.passWord = $scope.generatePassword();
					$scope.employee.department = $scope.departments[0];
					$scope.addEmployee.$setPristine();
					document.getElementById("addEmployee").reset();
					//logout
					$http.get("/logout").success(function(response){
						loginService.flush();
						alert("Were you trying to hypnotize our security!?\nSearch On...");
						window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
					}).error(function(e){
						console.log(e);
					});
					//
				}
				else{
					if(!f.flag){
						$scope.updated = true;
						$timeout(function () { $scope.updated = false; }, 3000);
						$scope.employee = {
								"userId"			: 	"",
								"passWord"			: 	"",
								"firstName"			:	"",
								"lastName"			: 	"",
								"emailAddress"		: 	"",
								"mobile"			:	"",
								"department"		:	"",
								"dateJoined"		: 	"",
								"hasLaptop"			:	"",
								"hasAccessCard"		:	"",
								"hasDocument"		: 	"",
						};
						$scope.employee.passWord = $scope.generatePassword();
						$scope.employee.department = $scope.departments[0];
						$scope.addEmployee.$setPristine();
						document.getElementById("addEmployee").reset();
					}
					else{
						alert("Email and/or Mobile exists already!");
					}
				}
				
			}).error(function(){
				console.log("error");
			});
			//duplicate entry check at spring
		}
	}
	
	/**
	 * 	$scope.getData()
	 * 		• to retrieve list of all employees who have applied for resignation.
	 */
	//getting data form database
	$scope.getData = function(){
		$http.post("getPendingResignRequests", loginService.getUser()).success(function(response) {
			if(typeof(response) == "string"){
				$http.get("/logout").success(function(response){
					loginService.flush();
					alert("Were you trying to hypnotize our security!?\nSearch On...");
					window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
				}).error(function(e){
					console.log(e);
				});
			}
			else{
		        $scope.employeeData = response;
		        $scope.employeeData.dummyResignStatus = "";
				$scope.prr = true;
			}
	    });
	}
	
	/**
	 * 	$scope.postBack()
	 * 		• to respond to all the pending resignation requests.
	 * 		• hr is expected to respond in acceptance, rejection or scheduling of meeting.
	 * 		• Test-Cases
	 * 			→	Accept : (flag, confirmation, resignApplied) = (false, true, false)
	 * 			→ 	Reject : (flag, confirmation, resignApplied) = (true, true, true)
	 * 			→ 	Meeting: (flag, confirmation, resignApplied) = (false, false, false)
	 * 				• in case of scheduling meeting, the employee stays at the portal till the application is either accepted or rejected
	 */
	//preliminary application review by hr
	$scope.postBack = function(e){
	
		if(this.e.dummyResignStatus == "Accept"){
			this.e.dummyResignStatus = "Accepted";
			//FLAG
			this.e.resignEmployeeId.flag = false;
			this.e.resignEmployeeId.confirmation = true;	
			this.e.resignEmployeeId.resignApplied = false;
			//FLAG
		}
		else if(this.e.dummyResignStatus == "Reject")
		{
			this.e.dummyResignStatus = "Rejected";
			//FLAG
			this.e.resignEmployeeId.flag = true;
			this.e.resignEmployeeId.confirmation = true;	
			this.e.resignEmployeeId.resignApplied = true;
			//FLAG
		}
		else if(this.e.dummyResignStatus == "Call For Meeting")
		{
			this.e.dummyResignStatus = "Meet HR for further clarification";	
			//FLAG
			this.e.resignEmployeeId.flag = false;
			this.e.resignEmployeeId.confirmation = false;	
			this.e.resignEmployeeId.resignApplied = false;
			//FLAG
		}
		
		var date = new Date();
		var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
		var now = new Date(year, month, day, hours, minutes, seconds);
		now = now.toString();
		
		if(this.e.dummyResignStatus == 'Rejected')
			this.e.resignEmployeeId.resignStatus = (now.substr(0,15)+" | " + this.e.dummyResignStatus + " ~");
		else
			this.e.resignEmployeeId.resignStatus += (now.substr(0,15)+" | " + this.e.dummyResignStatus + " ~");
		
		$scope.holder = {};
		$scope.holder.employee = this.e;
		$scope.holder.liu = loginService.getUser();
		
		$http.post("addOrUpdateEmployeeHR", $scope.holder).success(function(err){
			if(typeof(err)=="string"){
				//logout
				$http.get("/logout").success(function(response){
					loginService.flush();
					alert("Were you trying to hypnotize our security!?\nSearch On...");
					window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
				}).error(function(e){
					console.log(e);
				});
				//
			}
			//$scope.getData();
		});
		
	}
	
	/**
	 * 	1.	vpr aka verified pending requests
	 * 		→ a flag to interact with verified pending request functionality
	 * 		→ hides the contents till view-requests button has been triggered 
	 * 	2.	prr aka pending resignation requests
	 * 		→ a flag to interact with pending resignation request functionality
	 * 		→ hides the contents till view-requests button has been triggered 
	 */
	$scope.vpr = false;
	$scope.prr = false;
	
	/**
	 * 	$scope.getVerifiedEmployeeData()
	 * 		• to retrieve list of all employees who have verified resignation requests and await relieve.	
	 */
	//getVerifiedEmployeeData
	$scope.getVerifiedEmployeeData = function(){
		$http.post("verifiedEmployee", loginService.getUser()).success(function(response) {
			if(typeof(response) == "string"){
				$http.get("/logout").success(function(response){
					loginService.flush();
					window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
				}).error(function(e){
					console.log(e);
				});
			}
			else{
				$scope.vpr = true;
				$scope.verifiedEmployeeData = response;
			}
	    });
	}
	
	/**
	 * 	$scope.relieve()
	 * 		• finally relieve employee so that employee shall download relieving-letter.
	 */
	//relieve
	$scope.relieve = function(a){
		
		var date = new Date();
		var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
		var now = new Date(year, month, day, hours, minutes, seconds);
		now = now.toString();
		
		a.resignEmployeeId.resignStatus += (now.substr(0,15) + " | Relieved. Check Your Action Pane To View Relieving Letter. ~");
		//FLAG
		a.resignEmployeeId.flag = true;
		a.resignEmployeeId.confirmation = false;
		a.resignEmployeeId.resignApplied = true;
		//FLAG

		var date = new Date();
		var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
		a.resignEmployeeId.relievedDate = new Date(year, month, day, hours, minutes, seconds);
		
		$scope.holder = {};
		$scope.holder.employee = a;
		$scope.holder.liu = loginService.getUser();
		
		$http.post("addOrUpdateEmployeeHR", $scope.holder).success(function(err){
			if(typeof(err)=="string"){
				//logout
				$http.get("/logout").success(function(response){
					loginService.flush();
					alert("Were you trying to hypnotize our security!?\nSearch On...");
					window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
				}).error(function(e){
					console.log(e);
				});
				//
			}
			else{
				$scope.getVerifiedEmployeeData();
			}
		});
	}

});