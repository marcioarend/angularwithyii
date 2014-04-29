var myApp = angular.module("myApp", [ 'ngRoute' ]).directive('ngReallyClick',
		[ function() {
			return {
				restrict : 'A',
				link : function(scope, element, attrs) {
					element.bind('click', function() {
						var message = attrs.ngReallyMessage;
						if (message && confirm(message)) {
							scope.$apply(attrs.ngReallyClick);
						}
					});
				}
			}
		} ]);


myApp.value('rootAdresse','/index.php?r=');
myApp.factory('clientId', function clientIdFactory(){
	return 'odododdo';
});

myApp.factory('UserFactory', function($http,$location,rootAdresse	){
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
	
	
});

myApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/user', {
		templateUrl : '/angular/user/userList.html',
		controller : 'UsersLoadController'
	}).when('/createuser', {
		templateUrl : '/angular/user/userCreate.html',
		controller : 'UserCreateController'
	}).when('/viewuser/:user_id', {
		templateUrl : '/angular/user/viewUser.html',
		controller : 'UserViewController'
	}).when('/updateuser/:user_id', {
		templateUrl : '/angular/user/userUpdate.html',
		controller : 'UserUpdateController'
	}).when('/useradmin', {
		templateUrl : '/angular/user/useradminlist.html',
		controller : 'UserListAdminController'
	}).when('/login', {
		templateUrl : '/angular/login.html',
		controller : 'LoginController'
	}).otherwise({
		redirectTo : '/user'
	});
}]);





myApp.controller('UsersLoadController', function($scope, $http,UserFactory) {
	UserFactory.getUsers().then(function (value){
		$scope.users = value.data;
	});


});

myApp.controller('UserCreateController', function($scope, $http, $location,UserFactory) {
	$scope.addUser = function() {
		UserFactory.addUser($scope.User);
	}

});

myApp.controller('UserViewController', function($scope, $http, $routeParams,$location,UserFactory) {
	UserFactory.viewUser($routeParams.user_id).then(function(value){
		$scope.User = value.data;
	});

	$scope.delete = function(data){
		UserFactory.deleteUser(data.id);
	}

});

myApp.controller('UserUpdateController', function($scope, $http, $routeParams,$location,UserFactory) {
	UserFactory.viewUser($routeParams.user_id).then(function(value){
		$scope.User = value.data;
	});
	
	
	$scope.updateUser = function() {
		UserFactory.update($scope.User);
	}
});

myApp.controller('UserListAdminController', function($scope, $http,$location,rootAdresse) {
	UserFactory.getUsers().then(function (value){
		$scope.users = value.data;
	});
	
	$scope.delete = function(data){
		UserFactory.deleteUser(data.id);
	}

});


myApp.controller('LoginController',function($http){
	
})
