/**
 * @Author : Pranav Sinha
 * 
 * @controller: dashboardCtrl
 * 
 * @dependencies (custom)
 * 		1.	loginService : to push or pull logged-in-user.
 * 
 * @filters: capitalize → makes first character of any input to uppercase and rest to lower case. only influences view doesn't modifies data.
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */

/**
 * @filter
 * 		• to capitalize
 */
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

/**
 * @controller: dashboardCtrl
 * 
 * @variables
 * 		1.	$scope.liu : logged-in-user object
 * 
 * @functions
 * 
 * 	** 	1. 	$http.get("public/login")
 * 			• to get logged-in-user sessions
 * 			• generally if wish to enable session feature at browser level then enabled.
 * 			• generally for testing, multiple tabs serve as independent processes in employee-exit-process, ergo, commented out and used browser-sessions instead.
 * 		2.	$scope.redirect
 * 			• redirects to post-login screen
 * 		3.	$scope.signOut
 * 			• features logout. pings logout-request-mapping-url
 * 		4.	restore()
 * 			• to restore initial state of nav-panel elements
 * 		5.	enlarge(id)
 * 			• receives id of an element in navbar, and applies custom animation on the view.
 * 			• whichever is selected appears to be larger and more opaque than the rest.
 * 	 
 */
app.controller("dashboardCtrl", function($scope, $location, $http, loginService, $state){
	/**
	 *	$http.get("public/login")
	 * 		• to get logged-in-user sessions
	 * 		• generally if wish to enable session feature at browser level then enabled.
	 * 		• generally for testing, multiple tabs serve as independent processes in employee-exit-process, ergo, commented out and used browser-sessions instead.
	 */
	/*$http.get("public/login").success(function(liu){
		loginService.addUser(liu);
		$scope.liu = loginService.getUser();
		if($scope.liu.enabled == false){
			$location.url("/login");
		}
	}).error(function(e){
		$location.url("/login");
	});*/
	
	/**
	 * additional secondary security check in case some over-smart user finds way to this controller.
	 */
	$scope.liu = loginService.getUser();
	if($scope.liu == null)
		$location.url("/login");
	else if(angular.isUndefined($scope.liu))
		$location.url("/login");
	else if(angular.isUndefined($scope.liu.firstName) || $scope.liu.firstName == '')
		$location.url("/login");		
	
	/**
	 * 	$scope.redirect
	 * 		• redirects to post-login screen
	 */
	$scope.redirect = function(){
		$state.go("dashboard.postLogin");
	}
	
	/**
	 * 	$scope.signOut
	 * 		• features logout. pings logout-request-mapping-url
	 */
	//signOut
	$scope.signOut = function(){
		
		$http.get("/logout").success(function(response){
			loginService.flush();
			$location.url("/login");
		}).error(function(e){
			console.log(e);
		});
		
	}

});

//same old javascript

/**
 * 	restore()
 * 		• to restore initial state of nav-panel elements
 */
function restore(){
	document.getElementById("_0").style.fontSize = "13px";
	document.getElementById("_0").style.opacity = "1";
	document.getElementById("_1").style.fontSize = "15px";
	document.getElementById("_1").style.opacity = "1";
	document.getElementById("_2").style.fontSize = "13px";
	document.getElementById("_2").style.opacity = "1";
}

/**
 * 	enlarge(id)
 * 		• receives id of an element in navbar, and applies custom animation on the view.
 * 		• whichever is selected appears to be larger and more opaque than the rest.
 */
function enlarge(id){
	if(id==0){
		document.getElementById("_0").style.fontSize = "23px";
		document.getElementById("_0").style.opacity = "1";
		document.getElementById("_1").style.fontSize = "18px";
		document.getElementById("_1").style.opacity = "0.7";
		document.getElementById("_2").style.fontSize = "13px";
		document.getElementById("_2").style.opacity = "0.5";
	}
	else if(id==1){
		document.getElementById("_0").style.fontSize = "15px";
		document.getElementById("_0").style.opacity = "0.6";
		document.getElementById("_1").style.fontSize = "23px";
		document.getElementById("_1").style.opacity = "1";
		document.getElementById("_2").style.fontSize = "15px";
		document.getElementById("_2").style.opacity = "0.6";
	}
	else{
		document.getElementById("_0").style.fontSize = "13px";
		document.getElementById("_0").style.opacity = "0.5";
		document.getElementById("_1").style.fontSize = "18px";
		document.getElementById("_1").style.opacity = "0.7";
		document.getElementById("_2").style.fontSize = "23px";
		document.getElementById("_2").style.opacity = "1";
	}
}