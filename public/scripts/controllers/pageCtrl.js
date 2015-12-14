wikiApp.controller('pageCtrl',['$scope','adminService','$routeParams','$filter',function($scope,adminService,$routeParams,$filter){
	
	init=	function(){
		console.log('you are in page Ctrl');
		$scope.params	=	$routeParams;
		function loadData(){
			$scope.page	=	{};
			var promise	=	adminService.getPageById($scope.params.id);
			promise.then(
				function(result){
					console.log(result);
					$scope.page	=	result.data;
					
					$scope.breadCrumbs	=	[{'text':'Home','link':'/#home'},{'text':$scope.page.category_id.name,'link':'/#'+$scope.page.category_id.name+'/'+$scope.page.category_id._id},{'text':$scope.page.subcategory_id.name,'link':'/#'+$scope.page.category_id.name+'/'+$scope.page.subcategory_id.name+'/'+$scope.page.subcategory_id._id}];
				}
			);
		}
		loadData();
	}
	
	init();
}]);