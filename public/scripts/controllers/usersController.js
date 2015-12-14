wikiApp.controller('usersController',['$scope','$http','ngTableParams','adminService','$q','$filter',function($scope,$http,ngTableParams,adminService,$q,$filter){
	
	init	=	function(){
		function loadData(){
			var promise	=	adminService.getUsers();
			promise.then(
				function(result){
					$scope.users	=	result.data;
					console.log($scope.users);
				}
			);
			
			var promise	=	adminService.getUserRoles();
			promise.then(
				function(result){
					$scope.userRoles	=	result.data;
				}
			);
		}
		loadData();
		$scope.addNewUser	=	function(){
			$scope.newUser	=	{};
			$('#addUserPopup').modal('show');
		}
		
		
		$scope.deleteUser	=	function(delId){
			adminService.deleteUser(delId);
			loadData();
		}
		
		$scope.createUser	=	function(){
			if(!$scope.newUser.avatar){
				$scope.newUser.avatar	=	$scope.setDefaultImage();
			}
			$scope.newUser.lid	=	$filter('lowercase')($scope.newUser.lid)
			adminService.createUser($scope.newUser);
			loadData();
			$('#addUserPopup').modal('hide');
			$scope.$emit('refreshParent',{});
		};
	
		$scope.editUserPopupOpen	=	function(id){
			var promise	=	adminService.getUserById(id);
			promise.then(
				function(result){
					console.log(result);
					$scope.newUser	=	result.data;
					$scope.newUser.role_id	=	result.data.role._id;
					$('#addUserPopup').modal('show');
				}
			)
		}
	
		$scope.editUser	=	function(){
			var promise	=	adminService.updateUser($scope.newUser);
			promise.then(
				function(result){
					loadData();
					$('#addUserPopup').modal('hide');
				}
			)
		};
	
	
		$scope.makeUserActive	=	function(item){
			item.active	=	!item.active;
			adminService.makeUserActive(item);
			$scope.$emit('refreshParent',{});
		};
		
		$scope.$on("userAvatar",function(event,args){
			if($scope.newUser.avatar){
				var oldimage	=	$scope.newUser.avatar;
				$scope.newUser.avatar	=	args.file;
				adminService.deleteFile(oldimage);
			}
			$scope.newUser.avatar	=	args.fileName;
		});
		
		$scope.tableParams = new ngTableParams({
			page: 1,           
			count: 10
		}, {
			getData: function($defer, params) {
				setTimeout(function(){
					var orderedData = $scope.users;
					params.total($scope.users.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			},
			$scope: { $data: {} }
		});
		
		$scope.$watch("users", function () {
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
		});
	}
	
	init();
}]);

