/**
 * @Author : Pranav Sinha
 * 
 * @application: eep (employee exit process)
 * @dependencies: ui-router
 * @functions
 * 		• app.config (configuration)
 * 			→ contains all url pattern matching algorithm
 * 
 * @Note :  To have a comprehensive description, go to function declaration.
 * 
 */
var app = angular.module("eep", ['ui.router', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){

	$stateProvider
	.state('login', {
		url: "/login",
		views: {
			'': {
				templateUrl: "login.html",
				controller: "loginCtrl",
			}
		}
	})
	.state('dashboard', {
		url: "/dashboard",
		views: {
			'': {
				templateUrl: "dashboard.html",
				controller: "dashboardCtrl",
			}
		}
	})
	.state('dashboard.all', {
		url: "/all",
		views: {
			'default@dashboard': {
				templateUrl: "dept_hr_all.html",
				controller: "allCtrl",
			}
		}
	})
	.state('dashboard.postLogin', {
		url: "/_postlogin",
		views: {
			'default@dashboard': {
				templateUrl: "_postLogin.html",
				controller: "dashboardCtrl",
			}
		}
	})
	.state('dashboard.acc', {
		url: "/acc",
		views: {
			'default@dashboard': {
				templateUrl: "dept_acc.html",
				controller: "accCtrl",
			}
		}
	})
	.state('dashboard.hr', {
		url: "/hr",
		views: {
			'default@dashboard': {
				templateUrl: "dept_hr.html",
				controller: "hrCtrl",
			}
		}
	})
	.state('dashboard.infra', {
		url: "/infra",
		views: {
			'default@dashboard': {
				templateUrl: "dept_infraa.html",
				controller: "infraCtrl",
			}
		}
	})
	.state('dashboard._profile', {
		url: "/_profile",
		views: {
			'default@dashboard': {
				templateUrl: "_profile.html",
			}
		}
	})
	.state('dashboard._action', {
		url: "/_action",
		views: {
			'default@dashboard': {
				templateUrl: "_action.html",
			}
		}
	})
	.state('dashboard._action.relieved', {
		url: "/relieved",
		views: {
			'default@dashboard': {
				templateUrl: "relieved.html",
			}
		}
	})
	.state('dashboard._postLogin', {
		url: "",
		views: {
			'default@dashboard': {
				templateUrl: "dashboard.html",
			}
		}
	})
	$urlRouterProvider.otherwise("/login");
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});