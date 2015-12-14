wikiApp.controller('userRolesController',['$scope','$http','ngTableParams','adminService','$q',function($scope,$http,ngTableParams,adminService,$q){
	
	init	=	function(){
		function loadData(){
			var promise	=	adminService.getUserRoles();
			promise.then(
				function(result){
					$scope.userRoles	=	result.data;
				}
			);
		}
		loadData();
		$scope.addRolePopup	=	function(){
			$scope.newRole	=	{};
			$('#addRolePopup').modal('show');
		}
		
		
		$scope.deleteRole	=	function(delId){
			adminService.deleteUserRole(delId);
			loadData();
		}
		
		$scope.addRole	=	function(){
			adminService.createUserRole($scope.newRole);
			loadData();
			$('#addRolePopup').modal('hide');
			$scope.$emit('refreshParent',{});
		};
	
		$scope.editRolePopupOpen	=	function(id){
			var promise	=	adminService.getUserRoleById(id);
			promise.then(
				function(result){
					$scope.newRole	=	result.data;
					$('#addRolePopup').modal('show');
				}
			)
		}
	
		$scope.editRole	=	function(){
			var promise	=	adminService.updateUserRole($scope.newRole);
			promise.then(
				function(result){
					loadData();
					$('#addRolePopup').modal('hide');
				}
			)
		};
	
	
		$scope.makeRoleActive	=	function(item){
			item.active	=	!item.active;
			adminService.makeUserRoleActive(item);
			$scope.$emit('refreshParent',{});
		};
	}
	
	init();
}]);

