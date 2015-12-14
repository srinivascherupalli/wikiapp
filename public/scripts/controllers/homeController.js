wikiApp.controller('homeController',['$scope','adminService',function($scope,adminService){
	
	init=	function(){
		function loadCategories(){
			var promise	=	adminService.getActiveCategories();
			promise.then(
				function(result){
					$scope.categories	=	result.data;
				},function(error){
					console.log(error);
				}
			);
		}
		loadCategories();
	}
	
	init();
}]);