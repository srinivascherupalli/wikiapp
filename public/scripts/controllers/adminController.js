wikiApp.controller('adminController',['$scope','$http','ngTableParams','fileUpload','adminService','$q',function($scope,$http,ngTableParams,fileUpload,adminService,$q){
	
	init	=	function(){
		$scope.currentPage	=	"/views/admin/welcome.html";
		$scope.sections	=	adminService.mainSections;
		
		//show sections
		$scope.showSection	=	function(id){
			angular.forEach($scope.sections,function(item){
				item.active	=	false;
			});
			$scope.currentPage	=	$scope.sections[id-1].url;
			$scope.sections[id-1].active	=	true;
		}
	}
	init();
}]);

