wikiApp.controller('siteConfigController',['$scope','$http','ngTableParams','fileUpload','adminService','$q',function($scope,$http,ngTableParams,fileUpload,adminService,$q){
	
	init	=	function(){
		function loadData(){
			var promise	=	adminService.getSiteConfig();
			promise.then(
				function(result){
					$scope.siteConfig	=	result.data;
				}
			);
		}
		loadData();
		$scope.addNewSiteConfigPopup	=	function(){
			$scope.newSiteConfig	=	{};
			$('#addSiteConfigPopup').modal('show');
		}
		
		
		$scope.deleteSiteConfig	=	function(delId){
			adminService.deleteSiteConfig(delId);
			loadData();
		}
		
		$scope.$on("siteAvatar",function(event,args){
			if($scope.newSiteConfig.avatar){
				var oldimage	=	$scope.newSiteConfig.avatar;
				$scope.newSiteConfig.avatar	=	args.file;
				adminService.deleteFile(oldimage);
			}
			console.log($scope.newSiteConfig);
			$scope.newSiteConfig.avatar	=	args.fileName;
		});
	
		$scope.addSiteConfig	=	function(){
			if(!$scope.newSiteConfig.avatar){
				$scope.newSiteConfig.avatar	=	$scope.setDefaultImage();
			}
			adminService.createSiteConfig($scope.newSiteConfig);
			loadData();
			$('#addSiteConfigPopup').modal('hide');
			$scope.$emit('refreshParent',{});
		};
	
		$scope.editSiteConfigPopupOpen	=	function(id){
			var promise	=	adminService.getSiteConfigById(id);
			promise.then(
				function(result){
					$scope.newSiteConfig	=	result.data;
					$('#addSiteConfigPopup').modal('show');
				}
			)
		}
	
		$scope.editSiteConfig	=	function(){
			console.log($scope.newSiteConfig);
			var promise	=	adminService.updateSiteConfig($scope.newSiteConfig);
			promise.then(
				function(result){
					console.log(result);
					loadData();
					$scope.$emit('refreshParent',{});
					$('#addSiteConfigPopup').modal('hide');
				}
			)
		};
	
	
		$scope.makeSiteActive	=	function(item){
			item.active	=	!item.active;
			adminService.makeSiteActive(item);
			$scope.$emit('refreshParent',{});
		};
	}
	
	init();
}]);

