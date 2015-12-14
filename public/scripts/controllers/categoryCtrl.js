wikiApp.controller('categoryCtrl',['$scope','adminService','$routeParams','$filter',function($scope,adminService,$routeParams,$filter){
	
	init=	function(){
		$scope.params	=	$routeParams;
		$scope.users	=	null;
		function loadData(){
			$scope.leftBlock	=	{};
			$scope.blocks	=	{};
			$scope.page	=	{};
			$scope.showPage	=	false;
			
			if(!$scope.params.subcat_name	&&	$filter('lowercase')($scope.params.cat_name)!='contacts'){
				var promise	=	adminService.getCategoryById($scope.params.id);
				promise.then(
					function(result){
						$scope.leftBlock	=	result;
					}
				);
				
				var promise	=	adminService.getSubCategoryByCatId($scope.params.id);
				promise.then(
					function(result){
						if(result.data	==	''){
							$scope.showPage	=	true;
							var promise	=	adminService.getAllPageByCatId($scope.params.id);
							promise.then(
								function(result){
									if(result.data.length>0){
										$scope.page	=	result.data;
									}else{
										$scope.page	=	[{'content':'<h5>No content to display</h5>'}];
									}
								}
							);
						}else{
							$scope.blocks	=	result.data;
						}
					}
				);
				$scope.breadCrumbs	=	[{'text':'Home','link':'/#home'}];
			}
			
			if($scope.params.subcat_name	&&	$filter('lowercase')($scope.params.cat_name)!='contacts'){
				$scope.showPage	=	true;
				var promise	=	adminService.getSubCategoryById($scope.params.id);
				promise.then(
					function(result){
						$scope.leftBlock	=	result.data;
						$scope.breadCrumbs	=	[{'text':'Home','link':'/#home'},{'text':$scope.leftBlock.category_id.name,'link':'/#'+$scope.leftBlock.category_id.name+'/'+$scope.leftBlock.category_id._id}];
					}
				);
				
				var promise	=	adminService.getAllPageBySubCatId($scope.params.id);
				promise.then(
					function(result){
						if(result.data!='null'){
							if(result.data.length>0){
								$scope.page	=	result.data;
							}else if(result.data.length	==	0){
								$scope.page	=	[{'content':'<h5>No content to display</h5>'}];
							}else{
								result.data.content	=	result.data.content;
								$scope.page[0]	=	result.data;
							}
						}else{
							$scope.page	=	[{'content':'<h5>No content to display</h5>'}];
						}
					}
				);
			}
			
			if($filter('lowercase')($scope.params.cat_name)	==	'contacts'){
				
				if($scope.params.subcat_name){
					var promise	=	adminService.getUserById($scope.params.id);
					promise.then(
						function(result){
							$scope.leftBlock	=	result.data;
							$scope.leftBlock.bgcolor	=	'#d9edf7';
							$scope.userData	=	result.data;
							$scope.breadCrumbs	=	[{'text':'Home','link':'/#home'},{'text':$scope.params.cat_name,'link':'/#'+$scope.params.cat_name+'/55e925de48bb89a832000002'}];			
						}
					);
					
				}else{
					var promise	=	adminService.getCategoryById($scope.params.id);
					promise.then(
						function(result){
							$scope.leftBlock	=	result;
						}
					);
					
					var promise	=	adminService.getUsers();
					promise.then(
						function(result){
							$scope.users	=	result.data;
							$scope.breadCrumbs	=	[{'text':'Home','link':'/#home'}];
						}
					);
				}
			}

			$scope.page	=	function(){
				alert('hello');
				console.log('hi');
			};			
		}
		
		
		
		loadData();
	}
	
	init();
}]);