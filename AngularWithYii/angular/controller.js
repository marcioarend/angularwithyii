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
	}).otherwise({
		redirectTo : '/user'
	});
} ]);

/*
 * myApp.config(function ($routeProvider){ $routeProvider;
 * 
 * });
 */

myApp.controller('UsersLoadController', function($scope, $http) {
	console.log('controller');
	$http.get('/index.php?r=user').success(
			function(data, status, headers, config) {
				$scope.users = data;
				console.log(status);
			}).error(function(data, status, headers, config) {
		console.error(status);
	});

});

myApp.controller('UserCreateController', function($scope, $http, $location) {
	$scope.addUser = function() {
		$http.post('/index.php?r=user/create', $scope.User).success(
				function(data, status, headers, config) {
					console.log(status);
					$location.path('/viewuser/' + data.id);
				}).error(function(data, status, headers, config) {
			console.error(status);
		});

	}// addUser function

});

myApp.controller('UserViewController', function($scope, $http, $routeParams,
		$location) {
	console.log($routeParams.user_id);
	$http.get('/index.php?r=user/view&id=' + $routeParams.user_id).success(
			function(data, status, headers, config) {

				$scope.User = data;
				console.log(status);
			}).error(function(data, status, headers, config) {

	});
	$scope.delete = function(data){
		$http.get('/index.php?r=user/delete&id='+data.id)
		.success(function(data,status,headers,config){
			console.log(status);
			
		}).error(function(data,status,headers,config){
			console.error(status);
		});
		
	}

});

myApp.controller('UserUpdateController', function($scope, $http, $routeParams,
		$location) {
	$http.get('/index.php?r=user/view&id=' + $routeParams.user_id).success(
			function(data, status, headers, config) {

				$scope.User = data;
				console.log(status);
			}).error(function(data, status, headers, config) {

	});
	$scope.updateUser = function() {
		console.log($scope.User);
		$http.post('/index.php?r=user/update', $scope.User).success(
				function(data, status, headers, config) {
					console.log(data);
					console.log(status);
					$location.path('/viewuser/' + data.id);
				}).error(function(data, status, headers, config) {
			console.log(status);
		});
	}
});

myApp.controller('UserListAdminController', function($scope, $http,$location) {
	$http.get('/index.php?r=user').success(
			function(data, status, headers, config) {
				$scope.users = data;
				console.log(status);
			}).error(function(data, status, headers, config) {
		console.error(status);
	});
	
	$scope.delete = function(data){
		$http.get('/index.php?r=user/delete&id='+data.id)
		.success(function(data,status,headers,config){
			console.log(status);			
		}).error(function(data,status,headers,config){
			console.error(status);
		});
		
	}

});
