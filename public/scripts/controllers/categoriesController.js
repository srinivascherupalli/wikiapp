wikiApp.controller('categoriesController',['$scope','$http','ngTableParams','fileUpload','adminService','$q',function($scope,$http,ngTableParams,fileUpload,adminService,$q){
	
	init	=	function(){
		$scope.newCategory = {};
		$scope.categories	=	{};
		function loadData(){
			var promise	=	adminService.getCategories();
			promise.then(
				function(result){
					$scope.categories	=	result.data;
				},function(error){
					console.log(error);
				}
			);
		}
		loadData();
		
		$scope.addNewCategory	=	function(){
			$scope.newCategory	=	{};
			$scope.newCategory.avatar	=	"";
			$('#addCategoryPopup').modal('show');
		}
		
		$scope.deleteCategory	=	function(delId){
			var promise	=	adminService.getCategoryById(delId);
			promise.then(
				function(result){
					adminService.deleteFile(result.avatar);
					adminService.deleteCategory(delId);
					loadData();
				}
			);
		}
		
		$scope.editCategoryPopupOpen	=	function(id){
			$scope.newCategory.avatar	=	null;
			var promise	=	adminService.getCategoryById(id);
			promise.then(
				function(result){
					$scope.newCategory.avatar	=	null;
					$scope.newCategory	=	result;
					$('#addCategoryPopup').modal('show');
				}
			)
		}
		
		$scope.editCategory	=	function(){
			if(!$scope.newCategory.avatar	||	$scope.newCategory.avatar	==	''){
				$scope.newCategory.avatar	=	$scope.setDefaultImage();
			}
			var promise	=	adminService.updateCategory($scope.newCategory);
			promise.then(
				function(result){
					loadData();
					if($scope.oldAvatar){
						adminService.deleteFile($scope.oldAvatar);
					}
					$('#addCategoryPopup').modal('hide');
					$scope.newCategory	=	{};
				}
			);
		}
		
		$scope.makeCategoryActive	=	function(item){
			item.active	=	!item.active;
			adminService.makeCategoryActive(item);
			$scope.$emit('refreshParent',{});
		};
		
		$scope.$on("catAvatar",function(event,args){
			$scope.oldAvatar	=	null;
			if($scope.newCategory.avatar){
				$scope.oldAvatar	=	$scope.newCategory.avatar;
				$scope.newCategory.avatar	=	args.file;
			}
			$scope.newCategory.avatar	=	args.fileName;
		});
    
		$scope.createCategory = function(){
			$scope.newCategory.bgcolor	=	$scope.colorPalette[Math.floor(Math.random()*$scope.colorPalette.length)];
			if(!$scope.newCategory.avatar){
				$scope.newCategory.avatar	=	$scope.setDefaultImage();
			}
			$scope.newCategory.createdBy	=	$scope.authUser._id;
			var promise	=	adminService.addcategory($scope.newCategory);
			promise.then(
				function(result){
					loadData();
					$('#addCategoryPopup').modal('hide');
					$scope.newCategory	=	{};
				}
			);
		};
		
		$scope.tableParams = new ngTableParams({
			page: 1,           
			count: 10
		}, {
			getData: function($defer, params) {
				setTimeout(function(){
					var orderedData = $scope.categories;
					params.total($scope.categories.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			},
			$scope: { $data: {} }
		});
		
		$scope.$watch("categories", function () {
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
		});
		
		$scope.deleteFile	=	function(fileName){
			var promise	=	adminService.deleteFile(fileName);
			
			promise.then(
				function(result){
					$scope.newCategory.avatar	=	null;
				}
			);
		}
		
		$scope.changeCategoryOrder	=	function(category,index){
			console.log('hello'+category+'hi'+index);
			adminService.updateCategoryOrder(category,index);
		}
	}
	
	init();
}]);

