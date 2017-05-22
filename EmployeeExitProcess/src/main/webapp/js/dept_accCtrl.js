/**
 * @Author : Pranav Sinha
 * 
 * @controller: accCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.updateAllFlag
 * 			interacts with $scope.getData() | shows update-all button when true.
 * 		2.	$scope.dummyResignStatus
 * 			• dummy variable to append data to (logged-in-user).resignEmployeeId(mapped employee table to resignation table).resignStatus
 * 
 * @functions:
 * 		1.	$scope.back()
 * 			• like all the other department-specific-portals, gets triggered on go-back-button to go back to central dashboard screen.
 * 		2.	$scope.getData()
 * 			• function that retrieves all the employee-data whose progress at resignation-application is pending at accounts department.
 * 		3.	$scope.clearDuesAndPass()
 * 			• update application of single employee whose application is pending.
 * 		4.	$scope.accUpdateAll()
 * 			• update all applications with a single click.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */

//Accounts Controller
app.controller("accCtrl", function($rootScope, $scope, $location, loginService, $http, $state){
	
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
	if(loginService.getUser() == null || loginService.getUser().department != "Accounts"){
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
	 * 		• function that retrieves all the employee-data whose progress at resignation-application is pending at accounts department.
	 * 	$scope.updateAllFlag
	 * 		• to initially hide 'updateAll' button unless 'view pending request' button has been clicked
	 * 		• gets update to true in $scope.getData()
	 */
	// flag to momentarily hide 'update all' button till $scope.getData() is triggered.
	$scope.updateAllFlag = false;
	//get data from database
	$scope.getData = function(){
		$http.post("approved", loginService.getUser()).success(function(response) {
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

		        angular.forEach($scope.employeeData, function(e){
		        	//to calculate arrears
		        	var date = new Date();
					var year = date.getFullYear(), month = date.getMonth();
		        	var daysInMonth = new Date(year, month, 0).getDate();

		        	var d = Date(e.resignEmployeeId.resignAppliedDate);
		        	var str = (d.substr(4,6));
		        	var currDate = parseInt(str.substr(str.length-2, str.length-1));

		        	e.resignEmployeeId.arrears = (daysInMonth - currDate) * 2000;
		        	
		        	$scope.holder = {};
					$scope.holder.employee = e;
					$scope.holder.liu = loginService.getUser();
					
		        	$http.post("addOrUpdateEmployeeACC", $scope.holder).success(function(err){
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
		        	});
		        	
				})
				//console.log($scope.employeeData);
			}
	    });
	}

	//post back data
	$scope.dummyResignStatus={
			status: ''
		};
	
	/**
	 * 	$scope.clearDuesAndPass()
	 *		• purpose of this function is : clear dues and pass; as the name suggests.
	 *		• sets pending arrears to '0' and passes application to infrastructure department
	 */
	$scope.clearDuesAndPass = function(obj){ 
		
		$scope.dummyResignStatus.status = "Verified By Accounts Department, Pending At Infrastructure Team";
		obj.resignEmployeeId.arrears = 0;
		//FLAG
		obj.resignEmployeeId.flag = false;
		obj.resignEmployeeId.confirmation = true;	
		obj.resignEmployeeId.resignApplied = true;
		//FLAG
		
		var date = new Date();
		var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
		var now = new Date(year, month, day, hours, minutes, seconds);
		now = now.toString();
		obj.resignEmployeeId.resignStatus += (now.substr(0,15)+" | " + $scope.dummyResignStatus.status + " ~");
		
		$scope.holder = {};
		$scope.holder.employee = obj;
		$scope.holder.liu = loginService.getUser();
		
		$http.post("addOrUpdateEmployeeACC", $scope.holder).success(function(err){
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
	 * 	$scope.accUpdateAll()
	 * 		• update all applications with a single click.
	 * 		• unlike $scope.clearDuesAndPass(), it doesn't modifies arrears value, instead notifies employee about the same
	 * 		• however, if arrears equal to 0 then approves application and passes to hr for final review.
	 * 				   else simply updates employee to deposit/collect certain amount from the accounts department
	 */
	$scope.accUpdateAll = function(){
		angular.forEach($scope.employeeData, function(e){
			var st = "";
			if(e.resignEmployeeId.arrears == 0){
				st = "Verified By Accounts Department, Pending At Infrastructure Team";
				e.resignEmployeeId.arrears = 0;
				e.resignEmployeeId.resignApplied = true;
			}
			else{
				e.resignEmployeeId.resignApplied = false;
				if(e.resignEmployeeId.arrears >0)
					st = "You have to deposit INR"+e.resignEmployeeId.arrears+" to Accounts Department";
				else
					st = "You have to collect INR"+(e.resignEmployeeId.arrears*(-1))+" from Accounts Department";
			}
			
			var date = new Date();
			var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
			var now = new Date(year, month, day, hours, minutes, seconds);
			now = now.toString();
			e.resignEmployeeId.resignStatus += (now.substr(0,15)+" | "+ st + " ~");
			
			$scope.holder = {};
			$scope.holder.employee = e;
			$scope.holder.liu = loginService.getUser();
			
			$http.post("addOrUpdateEmployeeACC", $scope.holder).success(function(err){
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
		})
	}
	
});
