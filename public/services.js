macApp.service('userService', ['$q','$rootScope','$http', function($q, $rootScope, $http) {
	var userService= {};
	userService.getUsers = function($http){
		return $http.get('./users');
	}; 
	return userService;
}]);
