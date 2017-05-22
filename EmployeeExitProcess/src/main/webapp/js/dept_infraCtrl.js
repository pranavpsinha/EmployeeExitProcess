/**
 * @Author : Pranav Sinha
 * 
 * @controller: infraCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	
 *
 * @functions:
 * 		1.	$scope.back()
 * 			• like all the other department-specific-portals, gets triggered on go-back-button to go back to central dashboard screen.
 * 		2.	$scope.getData()
 * 			• function that retrieves all the employee-data whose progress at resignation-application is pending at accounts department.
 * 		3.	$scope.accessoriesReceived()
 * 			• one of the two actions at infrastructure department portal.
 * 			• simply signifies, accept accessories that employee is supposed to submit and pass application to hr for relieving letter
 * 		4.	$scope.infraUpdate()
 * 			• manually update each employee on grounds of accessories.
 * 		5.	$scope.infraUpdateAll()
 * 			• simply and automated call of $scope.infraUpdate() by picking up each and every employee from the list.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */

//Infrastructure Controller
app.controller("infraCtrl", function($rootScope, $scope, $location, loginService, $http, $state){
	
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
	if(loginService.getUser() == null || loginService.getUser().department != "Infrastructure"){
		console.log("overSmart!");
		loginService.flush();
		$http.get("/logout");
		$location.url("/login");
	}

	/**
	 * 	$scope.back()
	 * 		• like all the other department-specific-portals, gets triggered on go-back-button to go back to central dashboard screen.
	 */
	$scope.back = function(){
		restore();
		$state.go("dashboard");
	}
	
	/**
	 * 	$scope.getData()
	 * 		• function that retrieves all the employee-data whose progress at resignation-application is pending at infrastructure department.
	 * 	$scope.updateAllFlag
	 * 		• to initially hide 'updateAll' button unless 'view pending request' button has been clicked
	 * 		• gets update to true in $scope.getData()
	 */
	// flag to momentarily hide 'update all' button till $scope.getData() is triggered.
	$scope.updateAllFlag = false;
	//get data from database
	$scope.getData = function(){
		$http.post("pendingAtInfra", loginService.getUser()).success(function(response) {
			if(typeof(response) == "string"){
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
				$scope.employeeData = response;
				$scope.tableHeader = true;
				$scope.updateAllFlag = true;
			}
	    });
	}
	
	/**
	 * 	$scope.accessoriesReceived()
	 * 		• one of the two actions at infrastructure department portal.
	 * 		• simply signifies, accept accessories that employee is supposed to submit and pass application to hr for relieving letter
	 */
	$scope.accessoriesReceived = function(){
		this.e.hasLaptop = false;
		this.e.hasAccessCard = false;
		this.e.hasDocument = false;
		$scope.infraUpdate(this.e);
		$scope.infraUpdateAll();
	}
	
	/**
	 * 	$scope.infraUpdate()
	 * 		• manually update each employee on grounds of accessories.
	 * 		• if employee has no accessories in possession, simply verify pass the application
	 * 		  else notify employee to submit the accessories in possession.
	 */
	$scope.infraUpdate = function(obj){

		var date = new Date();
		var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
		var now = new Date(year, month, day, hours, minutes, seconds);
		now = now.toString();
		
		if(obj.hasLaptop == false && obj.hasDocument == false && obj.hasAccessCard == false){
			obj.resignEmployeeId.resignStatus += (now.substr(0,15) + " | " + "Verified By Infrastructure Department, Pending At HR For Final Review ~");
			//FLAG
			obj.resignEmployeeId.flag = true;
			obj.resignEmployeeId.confirmation = false;	
			obj.resignEmployeeId.resignApplied = false;
			//FLAG
		}
		else {
			//FLAG
			obj.resignEmployeeId.confirmation = true;
			obj.resignEmployeeId.resignApplied = true;
			//FLAG
			var status = "Please submit these to Infrastructure Department : "
			if(obj.hasLaptop == true)
				status += "Laptop ";
			if(obj.hasDocument == true)
				status += "Document(s) ";
			if(obj.hasAccessCard == true)
				status += "Access-Card"
			obj.resignEmployeeId.resignStatus += (now.substr(0,15) + " | " + status+" ~");
		}
		
		$scope.holder = {};
		$scope.holder.employee = obj;
		$scope.holder.liu = loginService.getUser();
		
		$http.post("addOrUpdateEmployeeINFRA", $scope.holder).success(function(err){
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
				$scope.getData();
			}
		});
		
	}
	
	/**
	 * 	$scope.infraUpdateAll()
	 * 		• simply an automated call of $scope.infraUpdate() by picking up each and every employee from the list.
	 */
	//update all
	$scope.infraUpdateAll = function(){
		angular.forEach($scope.employeeData, function(e){
			$scope.infraUpdate(e);
		})
	}
});