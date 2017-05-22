/**
 * @Author : Pranav Sinha
 * 
 * @controller: _profileCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @variables:
 * 		1.	$scope.loggedInUser : logged-in-user object.
 * 		2.	prevEmail, prevMobile
 * 			• to track redundancy check at profile update.
 * 		3.	$scope.pattern
 * 			• to check validity of e-mail.
 * 		4.	$scope.updated
 * 			• flag variable | initialized as false, when profile successfully updates, is updated to true for 3 seconds. 
 * 			• this flag is linked to a message which shows for 3 seconds when profile is successfully updated.
 * 
 * @functions:
 * 		1.	$scope.updateProfile()
 * 			• simply doesn't relies on form validations on html-page.
 * 			• again checks for valid data and if everything foes fine then only lets user trigger update profile request-mapping.
 * 			• if any data-field is missing or invalid, as a double check, marks all field invalid.
 * 			TestCases
 * 				• if data-change is recorded, an alert is prompted.
 * 				• if data already exists in database with some other user, an alert is prompted.
 * 				• if valid data is passed, successfully updates database.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */
app.controller("_profileCtrl", function(loginService, $scope, $http, $timeout, $rootScope){
	
	/**
	 * temporarily pause notification refresh when not on notifications page
	 */
	clearInterval($rootScope.periodicNotificationsC);
	clearInterval($rootScope.periodicNotificationsHR1);
	clearInterval($rootScope.periodicNotificationsHR2);
	clearInterval($rootScope.periodicNotificationsACC);
	clearInterval($rootScope.periodicNotificationsINFRA);
	
	$scope.loggedInUser = loginService.getUser();
	var prevEmail = $scope.loggedInUser.emailAddress;
	var prevMobile = $scope.loggedInUser.mobile;
	//_profile operations
	$scope.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.updated = false;
	
	/**
	 * $scope.updateProfile()
	 *		• simply doesn't relies on form validations on html-page.
	 *		• again checks for valid data and if everything foes fine then only lets user trigger update profile request-mapping.
	 *		TestCases
	 *			• if data-change is recorded, an alert is prompted.
	 *			• if data already exists in database with some other user, an alert is prompted.
	 *			• if valid data is passed, successfully updates database.
	 */
	$scope.updateProfile = function(){
		if(!($scope.loggedInUser.mobile==null || $scope.loggedInUser.emailAddress==null || $scope.loggedInUser.passWord==null)){
			if(!($scope.loggedInUser.mobile.length!=10 || !$scope.pattern.test($scope.loggedInUser.emailAddress) || $scope.loggedInUser.passWord.length<5)){
				
				//duplicate entry check at spring because stupid js is asynchronous
				$http.post("updateEmployee", $scope.loggedInUser).success(function(data){
					
					if(data.emailAddress == prevEmail && data.mobile == prevMobile)
						alert("Data already exists!");
					else{
						prevEmail = data.emailAddress;
						prevMobile = data.mobile;
						$scope.updated = true;
						$timeout(function () { $scope.updated = false; }, 3000);
					}
					loginService.flush();
					loginService.addUser(data);
					$scope.loggedInUser = loginService.getUser();
				});
				
			}
			else{
				angular.forEach($scope.updateLiu.$error.required, function(field) {
					field.$setDirty();
				});
			}
		}
	}
});