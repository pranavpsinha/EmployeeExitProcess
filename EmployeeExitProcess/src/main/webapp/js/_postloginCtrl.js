/**
 * @Author : Pranav Sinha
 * 
 * @controller: regularCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.liu : logged-in-user object.
 * 		2.	periodicNotificationsC
 * 			• C refers to common.
 * 			• refreshes notification at an interval of 0.5 seconds for any logged-in-user.
 * 		3.	periodicNotificationsHR1
 * 			• HR1 refers to pending resignation requests.
 * 			• refreshes notification at an interval of 0.5 seconds.
 *		4.	periodicNotificationsHR2
 *			• HR2 refers to verified resignation requests.
 *			• refreshes notification at an interval of 0.5 seconds.
 *		5.	periodicNotificationsACC
 *			• ACC refers to accounts department.
 *			• refreshes notification at an interval of 0.5 seconds for all pending applications at accounts department.
 *		6.	periodicNotificationsINFRA
 *			• INFRA refers to infrastructure department.
 *			• refreshes notification at an interval of 0.5 seconds for all pending applications at infrastructure department.
 * 
 * @functions:
 * 			
 * 		1.	$scope.refreshNotifications()
 * 			• pings dedicated request-mapping-urls to update certain data (specific to each department and purpose).
 * 			• called under variables of pattern "periodicNotifications(*)" at an interval of 0.5 seconds.
 * 		
 * 		2.	$scope.redirect()
 * 			• redirects logged-in-user to respective portals depending on their department.
 * 			• a regular employee ha no department-specific-portal so can not access this function.
 * 
 * 		3.	$scope.all()
 * 			• function which is only available to HR to view all the employees with certain pertinent details in view.
 * 			• displays
 * 				Id • FirstName+LastName • Department • JoinedOn • EmailId • Mobile • Resigned (if yes then resignAppliedDate too).
 * 
 * 		4. 	$scope.print()
 * 			• when logged-in-user has verified resignation request, he goes to relieving letter.
 * 			• this function lets user print relieving letter - eventually save the letter in pdf format.
 * 			• also, assigns default file name of pattern : RelievingLetter-(logged-in-user-name)-(current-time-stamp).
 * 			• features a check mechanism so that logged-in-user can only trigger account deactivation once and under no circumstances shall it be avoided or re-triggered.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */
app.controller("regularCtrl", function($scope, loginService, $http, $state, $rootScope){
	
	$http.post("refreshEmployee", loginService.getUser()).success(function(e){
		loginService.addUser(e);
		$scope.liu = loginService.getUser();
	});
	
	
	//$scope.notification = loginService.getNotifications();
	//common notifications
	/**
	 * 	START	:	Periodic functions to refresh notifications at dedicated portals/pages.
	 */
	$rootScope.periodicNotificationsC = setInterval($scope.refreshNotifications = function(){
		if(loginService.getUser() == null)
			clearInterval($rootScope.periodicNotificationsC);
		var temp = $scope.liu;
		if(temp!=null && temp.resignEmployeeId != null){
			var resignationId = temp.resignEmployeeId.resignationId;
			$http.post("refreshNotifications", resignationId).success(function(ting){
				var date = new Date();
				//loginService.pushNotifications(ting.resignStatus);
				//$scope.notification = loginService.getNotifications();
				var status_long = ting.resignStatus;
				var end = status_long.length;
				var temp = "";
				$scope.notification = [];
				for(var i = 0; i<end; i++){
					if(status_long[i] == '~'){
						if($scope.notification[$scope.notification.length - 1] != temp)
							$scope.notification.push(temp);
						temp = "";
						continue;
					}
					else{
						temp += status_long[i];
					}
				}
			});
		}
	}, 500);
	//department specific notifications
	//HR
	$rootScope.periodicNotificationsHR1 = setInterval($scope.refreshNotifications = function(){
		if(loginService.getUser() == null)
			clearInterval($rootScope.periodicNotificationsHR1);
		if(loginService.getUser()!=null && loginService.getUser().department == "HR"){
			$http.post("getPendingResignRequests", loginService.getUser()).success(function(cra){
				var count = 0;
				angular.forEach(cra, function(c){
					count += 1;
				});
				$scope.pendingResignApplicationsCount = count + " Employee(s) Applied for Resignation.";
			});
		}		
	}, 500);
	
	$rootScope.periodicNotificationsHR2 = setInterval($scope.refreshNotifications = function(){
		if(loginService.getUser() == null)
			clearInterval($rootScope.periodicNotificationsHR2);
		if(loginService.getUser()!=null && loginService.getUser().department == "HR"){
			$http.post("verifiedEmployee", loginService.getUser()).success(function(cra){
				var count = 0;
				angular.forEach(cra, function(c){
					if(c.resignEmployeeId.flag == true)
						count += 1;
				});
				$scope.verifiedResignApplications = count + " Employee(s) are to be Relieved.";
			});
		}
	}, 500);
	
	//acc
	$rootScope.periodicNotificationsACC = setInterval($scope.refreshNotifications = function(){
		if(loginService.getUser() == null)
			clearInterval($rootScope.periodicNotificationsACC);
		if(loginService.getUser()!=null && loginService.getUser().department == "Accounts"){
			$http.post("approved", loginService.getUser()).success(function(cra){
				var count = 0;
				angular.forEach(cra, function(c){
					count += 1;
				});
				$scope.accountsApplications = count + " pending applications.";
			});
		}
	}, 500);

	//infra
	$rootScope.periodicNotificationsINFRA = setInterval($scope.refreshNotifications = function(){
		if(loginService.getUser() == null)
			clearInterval($rootScope.periodicNotificationsINFRA);
		if(loginService.getUser()!=null && loginService.getUser().department == "Infrastructure"){
			$http.post("pendingAtInfra", loginService.getUser()).success(function(cra){
				var count = 0;
				angular.forEach(cra, function(c){
					count += 1;
				});
				$scope.infrastructureApplications = count + " pending applications.";
			});
		}
	}, 500);
	
	/**
	 * 	END	:	Periodic functions to refresh notifications at dedicated portals/pages.
	 */
	
	/**
	 * $scope.redirect()
	 * 		• redirects logged-in-user to respective portals depending on their department.
	 * 		• a regular employee has no department-specific-portal; ergo, can not access this function.
	 */
	/*
	 *	ACCESS TO RESPECTIVE PORTALS
	 */
	$scope.redirect = function(){
		if($scope.liu.resignEmployeeId == null ||  ($scope.liu.resignEmployeeId.flag == true && $scope.liu.resignEmployeeId.confirmation == true && $scope.liu.resignEmployeeId.resignApplied == true)){
			if($scope.liu.department == 'Infrastructure')
				$state.go("dashboard.infra");
			if($scope.liu.department == 'Accounts')
				$state.go("dashboard.acc");
			if($scope.liu.department == 'HR')
				$state.go("dashboard.hr");	
		}
		else{
			alert("Since you have applied for resignation,\nyou no longer have access to the portal.\n\nkatti. you are leaving us.");
			restore();
			$state.go("dashboard._postLogin");
		} 
	}
	/**
	 * $scope.all()
	 *		• function which is only available to HR to view all the employees with certain pertinent details in view.
	 *		• displays
	 * 			→	Id • FirstName+LastName • Department • JoinedOn • EmailId • Mobile • Resigned (if yes then resignAppliedDate too).
	 */
	//all employee record at hr-portal
	$scope.all = function(){
		$state.go("dashboard.all");
	}
	//art-work on relieving letter
	var date = new Date();
	var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
	$scope.now = new Date(year, month, day, hours, minutes, seconds);
	$scope.now = $scope.now.toString().substr(0,15);
	
	/**
	 * 	$scope.print()
	 * 		• when logged-in-user has verified resignation request, he goes to relieving letter.
	 * 		• this function lets user print relieving letter - eventually save the letter in pdf format.
	 * 		• also, assigns default file name of pattern : RelievingLetter-(logged-in-user-name)-(current-time-stamp).
	 * 		• features a check mechanism so that logged-in-user can only trigger account deactivation once and under no circumstances shall it be avoided or re-triggered.
	 */
	$scope.print = function(){
		debugger;
		var title = "<title>RelievingLetter-" + $scope.liu.firstName + $scope.liu.resignEmployeeId.relievedDate + "</title>";
		var prtContent = document.getElementById("letter");
		var WinPrint = window.open('', 'RelievingLetter', 'left=0,top=0,width=900,height=600,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(title);
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
		
		//block user here
		if($scope.liu.resignEmployeeId.flag && !$scope.liu.resignEmployeeId.confirmation && $scope.liu.resignEmployeeId.resignApplied){
			$http.post("deactivate", $scope.liu).success(function(deactivated){
				$scope.liu.resignEmployeeId.flag = true;
				$scope.liu.resignEmployeeId.confirmation = true;
				$scope.liu.resignEmployeeId.resignApplied = false;
				$http.post("addOrUpdateEmployeeR", $scope.liu).success(function(err){
					if(typeof(err)=="string"){
						alert("Were you trying to hypnotize our security!?");
					}
					else{
						alert("Your account has been successfully triggered for deactivation in 24 hours from now!");
					}
				});
			});
		}
		else
			alert("Clock is ticking!\nBetter keep your letter safe.");
	}
});