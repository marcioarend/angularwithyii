var app = angular.module("MyApp", []);

function mainController($scope, $http) {
  $scope.date = {};

  // when landing on the page, get all todos and show them
    $http.get('/index.php?r=user/index').
        success(function(data, status, headers, config) {
          $scope.posts = data;
        }).
        error(function(data, status, headers, config) {
          // log error
        });

  // when submitting the add form, send the text to the node API
  $scope.suche = function() {
      console.log($scope.date);
    $http.post('http://bbnapp.com/index.php?r=statistik/changeDateViaSelectionLeft', $scope.date)
      .success(function(data,status,headers,config) {
        //$scope.date = {}; // clear the form so our user is ready to enter another
        $scope.posts = data;
        console.log("data " + data + " status " + status + " headers " + headers );
        
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  

}






