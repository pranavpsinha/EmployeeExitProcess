app.controller("loginCtrl", function($scope, $location, $http, loginService) {
	
	if(loginService.getUser() != null && loginService.getUser().enabled == true)
		$location.url("/dashboard");
	
	$scope.username = '';
	$scope.password = '';
	$scope.usernameFlag = false;
	$scope.passwordFlag = false;
	var data, encodedData;
	
	$scope.submit = function() {
		if($scope.username=='' || $scope.password=='' || typeof($scope.username)=='undefined' || typeof($scope.password)=='undefined'){
			if($scope.username=='' || typeof($scope.username)=='undefined'){
				document.getElementById("userId").placeholder = "Required!";
				document.getElementById("userId").className += " formInvalid";
				document.getElementById("userId").focus();
				
			}
			else if($scope.password=='' || typeof($scope.password)=='undefined'){
				document.getElementById("passWord").placeholder = "Required!";
				document.getElementById("passWord").className += " formInvalid";
				document.getElementById("passWord").focus();
			}
			
		}
		else{
			data = $scope.username+":"+$scope.password;
			var encodedData = btoa(data);
			$http({
				method : 'GET',
				url : 'public/login',
				headers : {
					'Authorization' : 'Basic ' + encodedData
				}

			}).success(function(response){
				$scope.loggedInUser = response;
				if($scope.loggedInUser != null){
					loginService.addUser($scope.loggedInUser);
					$location.url("/dashboard");
				}
				else{
					alert("Account Deactivated!");
				}
			}).error(function(){
				alert("Can't log you in!");
			});
		}
	}
	

	/**
	 * 	Storing flag variables for HR portal in session to retain portal content after refresh.
	 */
	sessionStorage.setItem("instructionF", "0");
	sessionStorage.setItem("addF", "1");
	sessionStorage.setItem("pendingF", "1");
	sessionStorage.setItem("verifiedF", "1");
	
});

app.service("loginService", function() {
	var liu = {};
	var notifications = [];

	var addUser = function(u) {
		liu.enabled = u.enabled;
		liu.employeeId = u.employeeId;
		liu.dateJoined = u.dateJoined;
		liu.department = u.department;
		liu.emailAddress = u.emailAddress;
		liu.firstName = u.firstName;
		liu.lastName = u.lastName;
		liu.hasAccessCard = u.hasAccessCard;
		liu.hasLaptop = u.hasLaptop;
		liu.hasDocument = u.hasDocument;
		liu.mobile = u.mobile;
		liu.userId = u.userId;
		liu.passWord = u.passWord;
		liu.resignEmployeeId =  u.resignEmployeeId;
		if(liu.resignEmployeeId != null)
			notifications.push(liu.resignEmployeeId.resignStatus);
		
		sessionStorage.setItem("liu", JSON.stringify(liu));
		
	};

	var getUser = function() {
		//return liu;
		return JSON.parse(sessionStorage.getItem("liu"));
	};
	
	var flushUser = function(){
		liu = {};
		notifications = [];
		sessionStorage.clear();
	}

	var pushNotifications = function(a){
		if(notifications[notifications.length-1] != a)
			notifications.push(a);
	}
	
	var getNotifications = function(){
		return notifications;
	}
	
	var delete_cookie = function(name) {
	    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};
	
	return {
		addUser 			: 	addUser,
		getUser				: 	getUser,
		flush				: 	flushUser,
		pushNotifications	: 	pushNotifications,
		getNotifications	:	getNotifications
	}
});