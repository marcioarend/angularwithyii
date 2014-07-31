var myApp = angular.module('myAuth', ['ngRoute']);

myApp.value('rootAdresse','/index.php?r=');



//**************************************************
//******************** LOGIN ***********************
//**************************************************

myApp.constant('AUTH_EVENTS', {
	loginSuccess : 'auth-login-success',
	loginFailed : 'auth-login-failed',
	logoutSuccess : 'auth-logout-success',
	sessionTimeout : 'auth-session-timeout',
	notAuthenticated : 'auth-not-authenticated',
	notAuthorized : 'auth-not-authorized'
});

myApp.constant('USER_ROLES', {
	all : '*',
	admin : 'admin',
	editor : 'editor',
	guest : 'guest'
});


myApp.factory('AuthService', function($http, Session,$rootScope,rootAdresse) {
	return {
		login : function(credentials) {
			return $http.post(rootAdresse + 'user/login', credentials).then(function(res) {
				console.log(res);
				$rootScope.userInfos = res.data;
			});
		},
		isAuthenticated : function() {
			return !!Session.userId;
		},
		isAuthorized : function(authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [ authorizedRoles ];
			}
			return (this.isAuthenticated() && authorizedRoles
					.indexOf(Session.userRole) !== -1);
		}
	};
});

myApp.service('Session', function() {
	this.create = function(sessionId, userId, userRole) {
		this.sessionId = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function() {
		this.sessionId = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
});




//**************************************************
//****************** END LOGIN *********************
//**************************************************

//**************************************************
//*************** HTTP FILTER **********************
//**************************************************


myApp.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location,$rootScope){
	return {
		request: function (config){
			//console.log("if you referesh, what reapens ?");
			if ($rootScope.userInfos){
				config.headers.Authorization = $rootScope.userInfos.sessionId;
				console.log("authInterceptor " + $rootScope.userInfos.sessionId);
			} else {
				config.headers.Authorization = "";
			}
			
			return config;
		},
        response: function(response){
//        	console.log(response);
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $location.path('/login');
            }else if (rejection.status === 403) {
            	$location.path('/userlist')
            	console.log("Response error 403" , rejection);
            	
            }
            return $q.reject(rejection);
        }
    };
}]);

myApp.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);

//**************************************************
//************ END HTTP FILTER *********************
//**************************************************

//**************************************************
//**************** FACTORYS ************************
//**************************************************

myApp.factory('InformationFactory', [, function(){
	return {show:"true", message:"voce nao pode acessar"};
	
}])


myApp.factory('UserFactory',['$http','$location','rootAdresse', function($http,$location,rootAdresse){
	var functions = {};
	functions.getUsers = function(){
		var value = $http.get(rootAdresse+ 'user').success(
				function(data, status, headers, config) {
				}).error(function(data, status, headers, config) {
					console.error(status);
		});
		return value;
	};
	functions.addUser = function (User){
		
		var value = $http.post(rootAdresse+'user/create', User).success(
			function(data, status, headers, config) {
				console.log(status);
				$location.path('/viewuser/' + data.id);
			}).error(function(data, status, headers, config) {
				console.error(status);
			});
		return value;
	};
	
	functions.viewUser = function (userId){
		var value =$http.get(rootAdresse + 'user/view&id=' + userId).success(
				function(data, status, headers, config) {
					console.log(status);
				}).error(function(data, status, headers, config) {
					console.log(status);
				});
		return value;
	};
	
	functions.deleteUser = function (userId){
		$http.get(rootAdresse + 'user/delete&id='+userId)
		.success(function(data,status,headers,config){
			console.log(status);
			
		}).error(function(data,status,headers,config){
			console.error(status);
		});
	}
	
	functions.update = function (User){
			$http.post(rootAdresse + 'user/update', User).success(
					function(data, status, headers, config) {
						console.log(data);
						$location.path('/viewuser/' + data.id);
					}).error(function(data, status, headers, config) {
						console.log(status);
			});
		
	}

	return functions;

}]);


//**************************************************
//**************** END FACTORYS ********************
//**************************************************



//**************************************************
//**************** CONTROLLERS *********************
//**************************************************



myApp.controller('ApplicationController', function($scope,$rootScope, USER_ROLES,
		AuthService) {
	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	
	$scope.showLoginInfos = function(){
			console.log($rootScope.userInfos);
			
	};
});

myApp.controller('UsersLoadController',['$scope', 'UserFactory', function($scope,UserFactory) {
	UserFactory.getUsers().then(function (value){
		$scope.users = value.data;
	});

}]);

myApp.controller('UserViewController',['$scope', '$routeParams','UserFactory', function($scope, $routeParams,UserFactory) {
//	UserFactory.viewUser($routeParams.user_id).then(function(value){
//		$scope.User = value.data;
//	});

	UserFactory.viewUser($routeParams.user_id)
		.success(function(data, status, headers, config) {
				$scope.User = data;	
				console.log(status);
		 }).error(function(data, status, headers, config) {
			 		$scope.information = {show:"true", message:"voce nao pode acessar"};
					console.error(status);
		});
	
	$scope.delete = function(data){
		UserFactory.deleteUser(data.id);
	}

}]);



myApp.controller('LoginController', function($scope, $rootScope,$location, AUTH_EVENTS,AuthService) {
	$scope.credentials = {
		username : '',
		password : ''
	};
	$scope.login = function(credentials) {
		AuthService.login(credentials);
		$location.path('/userlist');
	};
	
});



//**************************************************
//************ END CONTROLLERS *********************
//**************************************************



myApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : '/loginAngular/login.html',
		controller : 'LoginController'
	}).when('/userlist', {
		templateUrl : '/angular/user/userList.html',
		controller : 'UsersLoadController'
	}).when('/viewuser/:user_id', {
		templateUrl : '/angular/user/viewUser.html',
		controller : 'UserViewController'
	}).otherwise({
		redirectTo : '/'
	});
}]);





