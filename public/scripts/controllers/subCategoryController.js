wikiApp.controller('subCatController',['$scope','$http','ngTableParams','fileUpload','adminService','$q',function($scope,$http,ngTableParams,fileUpload,adminService,$q){
	
	init	=	function(){
		$scope.newCategory = {};
		$scope.categories	=	{};
		function loadData(){
			var promise	=	adminService.getCategories();
			promise.then(
				function(result){
					$scope.categories	=	result.data;
					console.log($scope.categories);
				},function(error){
					console.log(error);
				}
			);
			var promise	=	adminService.getSubCategories();
			promise.then(
				function(result){
					$scope.subCategories	=	result.data;
				},function(error){
					console.log(error);
				}
			);
		}
		loadData();
		
		$scope.addNewSubCategory	=	function(){
			$scope.newSubCategory	=	{};
			$scope.newSubCategory.avatar	=	null;
			$('#addSubCategoryPopup').modal('show');
		}
		
		$scope.deleteSubCategory	=	function(delId){
			var promise	=	adminService.getSubCategoryById(delId);
			promise.then(
				function(result){
					adminService.deleteFile(result.data.avatar);
					adminService.deleteSubCategory(delId);
					loadData();
				}
			);
		}
		
		$scope.editSubCategoryPopupOpen	=	function(id){
			var promise	=	adminService.getSubCategoryById(id);
			promise.then(
				function(result){
					$scope.newSubCategory	=	result.data;
					$scope.newSubCategory.category_id	=	$scope.newSubCategory.category_id._id;
					$('#addSubCategoryPopup').modal('show');
				}
			)
		}
		
		$scope.editSubCategory	=	function(){
			if(!$scope.newSubCategory.avatar	||	$scope.newSubCategory.avatar	==	''){
				$scope.newSubCategory.avatar	=	$scope.setDefaultImage();
			}
			var promise	=	adminService.updateSubCategory($scope.newSubCategory);
			promise.then(
				function(result){
					loadData();
					$('#addSubCategoryPopup').modal('hide');
					$scope.newSubCategory	=	{};
				}
			);
		}
		
		$scope.makeSubCategoryActive	=	function(item){
			item.active	=	!item.active;
			adminService.makeSubCategoryActive(item);
			$scope.$emit('refreshParent',{});
		};
		
		$scope.$on("subcatAvatar",function(event,args){
			console.log($scope.newSubCategory);
			if($scope.newSubCategory.avatar){
				var oldimage	=	$scope.newSubCategory.avatar;
				$scope.newSubCategory.avatar	=	args.file;
				adminService.deleteFile(oldimage);
			}
			$scope.newSubCategory.avatar	=	args.fileName;
		});
		
		$scope.createSubCategory = function(){
			$scope.newSubCategory.bgcolor	=	$scope.colorPalette[Math.floor(Math.random()*$scope.colorPalette.length)];
			if(!$scope.newSubCategory.avatar){
				$scope.newSubCategory.avatar	=	$scope.setDefaultImage();
			}
			$scope.newSubCategory.createdBy	=	$scope.authUser._id;
			var promise	=	adminService.addSubcategory($scope.newSubCategory);
			promise.then(
				function(result){
					loadData();
					$('#addSubCategoryPopup').modal('hide');
					$scope.newSubCategory	=	{};
				}
			);
		};
		
		$scope.tableParams = new ngTableParams({
			page: 1,           
			count: 10
		}, {
			getData: function($defer, params) {
				setTimeout(function(){
					var orderedData = $scope.subCategories;
					params.total($scope.subCategories.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			},
			$scope: { $data: {} }
		});
		
		$scope.$watch("subCategories", function () {
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
		});
		
		$scope.deleteFile	=	function(fileName){
			var promise	=	adminService.deleteFile(fileName);
			promise.then(
				function(result){
					$scope.newSubCategory.avatar	=	null;
				}
			);
		};
		
		$scope.changeSubCategoryOrder	=	function(subcategory,index){
			adminService.updateSubCategoryOrder(subcategory,index);
		}
	}
	
	init();
}]);

