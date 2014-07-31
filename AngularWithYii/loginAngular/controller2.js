var myApp = angular.module("myApp",[]);


myApp.factory("Data", function(){
	return {message : "ola mundo estou de volta"};
});


myApp.controller("testCtrl",function($scope,Data){
	$scope.data = Data;
});



myApp.controller("testCtrl2",function($scope,Data){
	$scope.data = Data;
	
	$scope.funcaoRevers = function(message){
		return message.split("").reverse().join("");
	}
});

