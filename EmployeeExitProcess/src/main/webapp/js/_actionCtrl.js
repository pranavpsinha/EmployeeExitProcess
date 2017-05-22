/**
 * @Author : Pranav Sinha
 * 
 * @controller: _actionCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.liu : logged-in-user object.
 * 
 * @functions:
 * 		1.	$scope.resign()
 * 			•function to facilitate logged-in-user to quit existing job.
 * 
 * 		2.	$scope.downloadPdf()
 * 			•function to redirect logged-in-user to download relieving letter when resignation has been processed and approved.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */
app.controller("_actionCtrl", function($scope, loginService, $http, $state, $rootScope){
	
	/**
	 * temporarily pause notification refresh when not on notifications page
	 */
	clearInterval($rootScope.periodicNotificationsC);
	clearInterval($rootScope.periodicNotificationsHR1); //pending resign requests
	clearInterval($rootScope.periodicNotificationsHR2); //verified resign requests
	clearInterval($rootScope.periodicNotificationsACC);
	clearInterval($rootScope.periodicNotificationsINFRA);
	
	/**
	 * getting logged-in-user from loginService.
	 */
	$http.post("refreshEmployee", loginService.getUser()).success(function(e){
		loginService.addUser(e);
		$scope.liu = loginService.getUser();
	});

	/**
	 * function to facilitate resignation feature.
	 * @variables:
	 * 		1.	today, dd, mm, yyyy
	 * 			• to calculate current date. sets "resignAppliedDate" in database.
	 * 		2. 	$scope.resignEntity = {}
	 * 			• object to set "Resign-Entity" column values.
	 */
	$scope.resign = function(){
		/**
		 * 	prevent default-users i.e. UserId : Password = admin : admin; a : a; i : i from resigning.
		 *	since, upon successful verification, account gets deactivated 2-days after download of relieving letter.
		 */
		if(!($scope.liu.userId == "admin" || $scope.liu.userId == "a" || $scope.liu.userId == "i")){
			/**
			 *	if 
			 *	• 	 this is the first time logged-in-user is applying for resignation,
			 *		 assign ResignEntity object to mapped foreign-key.
			 *
			 *	•	 update current "Resign-Entity" values.
			 *		 
			 *	primarily, sets flags (flag, confirmation, resignApplied) = (false, false, true).
			 *
			 */
			//calculating current time stamp
			var date = new Date();
			var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
			var now = new Date(year, month, day, hours, minutes, seconds);
			var nowStr = now.toString();
			
			if($scope.liu.resignEmployeeId == null){
				$scope.resignEntity = {};
				$scope.liu.resignEmployeeId = $scope.resignEntity;
			}
			
			$scope.liu.resignEmployeeId.resignAppliedDate = now;
			$scope.liu.resignEmployeeId.resignStatus = nowStr.substr(0,15)+" | "+"Applied for Resignation ~";
			
			//FLAG 001
			$scope.liu.resignEmployeeId.flag = false;
			$scope.liu.resignEmployeeId.confirmation = false;
			$scope.liu.resignEmployeeId.resignApplied = true;
			//FLAG
			
			/**
			 * update employee details.
			 */
			$http.post("addOrUpdateEmployeeR", $scope.liu).success(function(data){
				if(typeof(data)=="string"){
					alert("Were you trying to hypnotize our security!?");
				}
				else{
					$scope.liu.resignEmployeeId = data;
					loginService.addUser($scope.liu);
					$scope.liu = loginService.getUser();
				}
			});
		}
		else{
			alert("You are default user!\nWe need operators for test cases!\nIn short, you can't quit :P");
		}
	}
	
	/**
	 * redirect to relieving letter page. accessible only to those who have verified resignation requests.
	 */
	//download relieving letter
	$scope.downloadPdf = function(){
		$state.go("dashboard._action.relieved");
	}
});