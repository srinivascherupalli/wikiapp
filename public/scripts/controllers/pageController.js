wikiApp.controller('pageController',['$scope','$http','ngTableParams','fileUpload','adminService','$q','$location',function($scope,$http,ngTableParams,fileUpload,adminService,$q,$location){
	
	init	=	function(){
		$scope.newCategory = {};
		$scope.categories	=	{};
		
		function loadData(){
			
			var promise	=	adminService.getPages();
			promise.then(
				function(result){
					$scope.pages	=	result.data;
				},function(error){
					console.log(error);
				}
			);
			
			var promise	=	adminService.getCategories();
			promise.then(
				function(result){
					$scope.categories	=	result.data;
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
		
		$scope.addNewPage	=	function(){
			$scope.newPage	=	{};
			$scope.newPage.imageList	=	[];
			$scope.newPage.docList	=	[];
			$('#addPagePopup').modal('show');
		}
		
		$scope.deletePage	=	function(delId){
			var promise	=	adminService.getPageById(delId);
			promise.then(
				function(result){
					if(result.data.attachments	&&	result.data.attachments.length>0){
						angular.forEach(result.data.attachments,function(item){
							adminService.deleteFile(item.name);
						});
					}
					
					if(result.data.images	&&	result.data.images.length>0){
						angular.forEach(result.data.images,function(item){
							adminService.deleteFile(item.name);
						});
					}
					
					adminService.deletePage(delId);
					loadData();
				}
			)
			
		}
		
		$scope.editPagePopupOpen	=	function(id){
			var promise	=	adminService.getPageById(id);
			promise.then(
				function(result){
					$scope.newPage	=	result.data;
					console.log($scope.newPage);
					$scope.newPage.category_id	=	$scope.newPage.category_id._id;
					$scope.newPage.imageList	=	$scope.newPage.images;
					$scope.newPage.docList	=	$scope.newPage.attachments;
					if(!$scope.newPage.subcategory_id){
						$scope.newPage.subcategory_id	=	null;
					}else{
						$scope.newPage.subcategory_id	=	$scope.newPage.subcategory_id._id;
					}
					
					$('#addPagePopup').modal('show');
				}
			)
		}
		
		$scope.editPage	=	function(){
			var promise	=	adminService.updatePage($scope.newPage);
			promise.then(
				function(result){
					loadData();
					$('#addPagePopup').modal('hide');
				}
			);
		}
		
		$scope.pagePreview	=	function(id){
			var promise	=	adminService.getPageById(id);
			promise.then(
				function(result){
					result.data.content	=	'<div>'+result.data.content+'</div>';
					$scope.newPage	=	result.data;
					$('#pagePreviewPopup').modal('show');
				}
			)
		};
		
		$scope.makePageActive	=	function(item){
			item.active	=	!item.active;
			adminService.makePageActive(item);
			$scope.$emit('refreshParent',{});
		};
		
		$scope.createPage = function(){
			console.log($scope.newPage);
			$scope.newPage.createdBy	=	$scope.authUser._id;
			adminService.addPage($scope.newPage);
			loadData();
			$('#addPagePopup').modal('hide');
		};
		
		$scope.tableParams = new ngTableParams({
			page: 1,           
			count: 10
		}, {
			getData: function($defer, params) {
				setTimeout(function(){
					var orderedData = $scope.pages;
					params.total($scope.pages.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			},
			$scope: { $data: {} }
		});
		
		$scope.$on("pageImage",function(event,args){
			$scope.newPage.imageList.push({'name':args.fileName});
		});
		
		$scope.$on("pageDocs",function(event,args){
			$scope.newPage.docList.push({'name':args.fileName});
		});
		
		
		$scope.$watch("pages", function () {
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
		});
		
		$scope.imgUrl	=	function(image){
			return "http://"+$scope.hostName+":3000/images/"+image;
		}
		
		$scope.deleteAttach	=	function(list,index){
			var fileName	=	$scope.newPage.docList[index].name;
			var promise	=	adminService.deleteFile(fileName);
			promise.then(
				function(result){
					$scope.newPage.docList.splice(index,1);
				}
			);
		};
		
		$scope.deleteImage	=	function(list,index){
			var fileName	=	$scope.newPage.imageList[index].name;
			var promise	=	adminService.deleteFile(fileName);
			promise.then(
				function(result){
					$scope.newPage.imageList.splice(index,1);
				}
			);
		};
		
		
	}
	
	init();
}]);

