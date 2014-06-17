var myApp = angular.module("myApp", [ 'ngRoute' ]);

myApp.directive('ngReallyClick',
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

//CamelCase is converted to -. testDirective will be test-directive
myApp.directive('testDirective', function(){
	return {
		// restrict: "A", default is Attribute  
		template: "<div> ola. Esse elemento foi criado por uma diretiva </div>"
	}
});

myApp.directive('contadorMenu', function(StatisticFactory){
	var enterValue =0;
	var leaveValue =0;
	var timeEnter = '';
	
	//scope,element,attr
	return function(scope,element){
		var i=0;
		element.bind("mouseenter",function(){
			var d = new Date();
			timeEnter = d.getTime();
			//console.log(" enter " + this.id + "  " + enterValue++);
		})
		element.bind("mouseleave",function(){
			//console.log(" leave " + this.id + "  " + leaveValue++);
			var d = new Date();
			var timeLapse = d.getTime() - timeEnter;
			//console.log(" time in " + this.id + "  " + timeLapse);
			values={"idElement" : this.id,
					"inValue" :timeEnter,
					"outValue":d.getTime(),
					"sessionID" :"axsasef234"};
			StatisticFactory.setStatistic(values);
			
		})
	}
});




myApp.filter('inverter', function (){
	return function (text){
		return text.split("").reverse().join("");
	}	
});

myApp.factory('StatisticFactory' , ['$http','rootAdresse', function ($http,rootAdresse){
		var functions = {};
		functions.setStatistic = function(statisticValue){
			var value = $http.post(rootAdresse+ 'statistic',statisticValue).
			success(function(data,status,headers,config){
				console.log(status);
			}).
			error(function(data,status,headers,config){
				console.log(status);
			});
			return value;
		};
		functions.setPosition = function(positions){
			console.log(positions)
			$http.post(rootAdresse+ 'statistic/position',positions).success(function (status,data){
//				console.log(status);
				console.log(data);
				
			}).error(function (status,data){
				
			});
		}
		
		return functions;
}]);

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



myApp.controller('mousePosition',['$scope','StatisticFactory', function($scope,StatisticFactory){
	$scope.myposition = function(event){
		values={"X" :event.pageX,
				"Y": event.pageY,
				"sessionID" :"axsasef234"};
		StatisticFactory.setPosition(values);

	}
	
}]);




myApp.controller('UsersLoadController',['$scope', 'UserFactory', function($scope,UserFactory) {
	UserFactory.getUsers().then(function (value){
		$scope.users = value.data;
	});

}]);

myApp.controller('UserCreateController',['$scope', 'UserFactory', function($scope,UserFactory) {
	$scope.addUser = function() {
		UserFactory.addUser($scope.User);
	}

}]);

myApp.controller('UserViewController',['$scope', '$routeParams','UserFactory', function($scope, $routeParams,UserFactory) {
	UserFactory.viewUser($routeParams.user_id).then(function(value){
		$scope.User = value.data;
	});

	$scope.delete = function(data){
		UserFactory.deleteUser(data.id);
	}

}]);

myApp.controller('UserUpdateController',['$scope', '$routeParams','UserFactory', function($scope, $routeParams,UserFactory) {
	UserFactory.viewUser($routeParams.user_id).then(function(value){
		$scope.User = value.data;
	});
	
	
	$scope.updateUser = function() {
		UserFactory.update($scope.User);
	}
}]);

myApp.controller('UserListAdminController', ['$scope', 'UserFactory', function($scope,UserFactory) {
	UserFactory.getUsers().then(function (value){
		$scope.users = value.data;
	});
	
	$scope.delete = function(data){
		UserFactory.deleteUser(data.id);
	}

}]);


myApp.controller('LoginController',function($http){
	
})
