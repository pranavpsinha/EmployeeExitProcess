/**
 * @Author : Pranav Sinha
 * 
 * @controller: allCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.employees
 * 			• List<EmployeeEntity> type variable which stores all the employee data.
 * 			• only accessible to HR to view all the employee-data recorded in database.
 * 
 * @functions:
 * 		1.	$scope.get("getAllEmployees")
 * 			• to get all the employees to this controller into $scope.employees from back-end.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */

app.controller("allCtrl", function($http, $scope, $rootScope, loginService){
	
	/**
	 * temporarily pause notification refresh when not on notifications page
	 */
	clearInterval($rootScope.periodicNotificationsC);
	clearInterval($rootScope.periodicNotificationsHR1); //pending resign requests
	clearInterval($rootScope.periodicNotificationsHR2); //verified resign requests
	clearInterval($rootScope.periodicNotificationsACC);
	clearInterval($rootScope.periodicNotificationsINFRA);
	
	$http.post("getAllEmployees", loginService.getUser()).success(function(all){
		if(typeof(all) == "string"){
			$http.get("/logout").success(function(response){
				loginService.flush();
				window.location.href = "https://www.duckduckgo.com/?q=how+to+hack+a+website";
			}).error(function(e){
				console.log(e);
			});
		}
		else
			$scope.employees = all;
	});
});