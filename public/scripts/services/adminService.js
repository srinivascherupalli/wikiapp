wikiApp.service('adminService',['$q','$rootScope','$http',function($q,$rootScope,$http){
	
	var adminService	=	{};
	
	adminService.mainSections	=	[
		{name:'Categories',id:1,url:'views/admin/categories.html',active:false,role:'guest'},
		{name:'SubCategories',id:2,url:'views/admin/subcategories.html',active:false,role:'guest'},
		{name:'Pages',id:3,url:'views/admin/pages.html',active:false,role:'guest'},
		{name:'Users',id:4,url:'views/admin/users.html',active:false,role:'guest'},
		{name:'User Roles',id:5,url:'views/admin/userroles.html',active:false,role:'admin'},
		{name:'Site Configuration',id:6,url:'views/admin/siteconfig.html',active:false,role:'admin'}
	];
	
	//Categories
	adminService.getCategories	=	function(){
		return $http.get('/api/categories/')
	};
	adminService.getActiveCategories	=	function(){
		return $http.get('/api/activecategories/')
	};
	adminService.getCategoryById	=	function(id){
		var deferred = $q.defer();
		$http.get('/api/categories/'+id).success(function(result){
			deferred.resolve(result); 
		});
		return deferred.promise;
	};
	
	adminService.addcategory	=	function(newCategory){
		return $http.post('/api/categories', newCategory);
	};
	
	adminService.updateCategory	=	function(newCategory){
		return $http.post('/api/categories/'+newCategory._id,newCategory);
	};
	
	adminService.deleteCategory	=	function(id){
		$http.delete('/api/categories/' + id);
    };
	
	adminService.makeCategoryActive	=	function(item){
		return $http.post('/api/activeCategory/',item);
	}
	
	adminService.updateCategoryOrder	=	function(category,index){
		return $http.post('/api/updateCategoryOrder/'+index,category);
	}
	
	//SiteConfig
	
	adminService.getSiteConfig	=	function(){
		return $http.get('/api/siteconfig/');
	};
	
	adminService.getSiteConfigById	=	function(id){
		return $http.get('/api/siteconfig/'+id);
	};
	
	adminService.createSiteConfig	=	function(newSiteConfig){
		return $http.post('/api/createSiteConfig/',newSiteConfig);
	}
	adminService.updateSiteConfig	=	function(newSiteConfig){
		return $http.post('/api/siteconfig/'+newSiteConfig._id,newSiteConfig);
	}
	
	adminService.deleteSiteConfig	=	function(id){
		$http.delete('/api/siteconfig/'+id);
	}
	adminService.makeSiteActive	=	function(item){
		return $http.post('/api/activeSite/',item);
	}
	
	//SubCategories
	adminService.getSubCategories	=	function(){
		return $http.get('/api/subcategories/')
	};
	adminService.getActiveSubCategories	=	function(){
		return $http.get('/api/activesubcategories/')
	};
	adminService.getSubCategoryById	=	function(id){
		return $http.get('/api/subcategories/'+id);
	};
	
	adminService.addSubcategory	=	function(newSubCategory){
		return $http.post('/api/subcategories', newSubCategory);
	};
	
	adminService.updateSubCategory	=	function(newSubCategory){
		return $http.post('/api/subcategories/'+newSubCategory._id,newSubCategory);
	};
	
	adminService.deleteSubCategory	=	function(id){
		$http.delete('/api/subcategories/' + id);
    };
	
	adminService.makeSubCategoryActive	=	function(item){
		return $http.post('/api/activeSubCategory/',item);
	}
	
	
	adminService.getSubCategoryByCatId	=	function(id){
		return $http.get('/api/subcategoriesByCatId/'+id);
	};
	
	adminService.updateSubCategoryOrder	=	function(subcategory,index){
		return $http.post('/api/updateSubCategoryOrder/'+index,subcategory);
	};
	//Pages
	adminService.getPages	=	function(){
		return $http.get('/api/pages/')
	};
	adminService.getPageById	=	function(id){
		return $http.get('/api/pages/'+id);
	};
	
	adminService.addPage	=	function(page){
		return $http.post('/api/pages', page);
	};
	
	adminService.updatePage	=	function(page){
		return $http.post('/api/pages/'+page._id,page);
	};
	
	adminService.deletePage	=	function(id){
		$http.delete('/api/pages/' + id);
    };
	
	adminService.makePageActive	=	function(item){
		return $http.post('/api/activePage/',item);
	}
	
	adminService.getPageByCatId	=	function(id){
		return $http.get('/api/pageByCatId/'+id);
	};
	
	adminService.getPageBySubCatId	=	function(id){
		return $http.get('/api/pageBySubCatId/'+id);
	};
	adminService.getAllPageByCatId	=	function(id){
		return $http.get('/api/allPagesByCatId/'+id);
	};
	
	adminService.getAllPageBySubCatId	=	function(id){
		return $http.get('/api/allPagesBySubCatId/'+id);
	};
	//File Management
	adminService.uploadFile	=	function(fileName){
		$http.post('/api/uploadFile/'+fileName);
	}
	
	adminService.deleteFile	=	function(fileName){
		if(fileName	!=	'noimage.png'){
			return $http.delete('/api/deleteFile/'+fileName);
		}else{
			return true;
		}
		
	}
	
	
	/*User Access*/
	adminService.getUserRoles	=	function(){
		return $http.get('/api/userroles/')
	};
	adminService.getUserRoleById	=	function(id){
		return $http.get('/api/userroles/'+id);
	};
	adminService.createUserRole	=	function(newRole){
		return $http.post('/api/userroles/', newRole);
	};
	adminService.updateUserRole	=	function(newRole){
		return $http.post('/api/userroles/'+newRole._id,newRole);
	};
	
	adminService.deleteUserRole	=	function(id){
		$http.delete('/api/userroles/' + id);
    };
	
	adminService.makeUserRoleActive	=	function(item){
		return $http.post('/api/activeuserrole/',item);
	}
	
	
	/*Users*/
	adminService.getUsers	=	function(){
		return $http.get('/api/users/')
	};
	adminService.getUserById	=	function(id){
		return $http.get('/api/users/'+id);
	};
	
	adminService.getUserByLId	=	function(lid){
		return $http.get('/api/userByLid/'+lid);
	};
	
	adminService.createUser	=	function(newUser){
		return $http.post('/api/users/', newUser);
	};
	
	adminService.createGuestUser	=	function(newUser){
		return $http.post('/api/guestusers/', newUser);
	};
	
	adminService.updateUser	=	function(newUser){
		console.log('new User'+newUser);
		return $http.post('/api/users/'+newUser._id,newUser);
	};
	
	adminService.deleteUser	=	function(id){
		$http.delete('/api/users/' + id);
    };
	
	adminService.makeUserActive	=	function(item){
		return $http.post('/api/activeuser/',item);
	}
	
	adminService.checkUserLogin	=	function(user){
		console.log(user);
		return $http.post('/api/checkUserLogin/',user);
	}
	return adminService;
}]);

wikiApp.directive('fileModel', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
			el.bind('change', function (event) {
                var files = event.target.files;
				//iterate files since 'multiple' may be specified on the element
                //for (var i = 0;i<files.length;i++) {
                    //emit event upward
					scope.$emit("fileSelected", { file: files[0], model: attrs.fileModel });
					//scope.$emit(attrs.fileModel, { model: files[i].name });
                    el.val(null);                                   
            });
        }
    };
});

wikiApp.service('fileUpload', ['$q','$http', function ($q,$http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }
}]);

wikiApp.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {
		var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
			console.log(newHTML);
            $element.html('').append(newHTML); // Clear and append it
        };
		var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to 
                                                      // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });
	};
});


wikiApp.directive('restrict',['$filter',function($filter){
	return{
		restrict: 'A',
		scope: false,
		link: function(scope, element, attr){
			setTimeout(function(){
				var isViewable = false;
				var isEditable = false;
				if($filter('lowercase')(scope.authUser.role.name)	==	'admin'){
					return true;
				}
				if($filter('lowercase')(scope.authUser.role.name)	==	'guest'){
					if($filter('lowercase')(attr.editrole)	==	'guest'){
						return true;
					}
					if(attr.editaccess	==	scope.authUser._id){
						isEditable = true;
					}else{
						element.children().remove();
						element.remove();
					}
				}
				scope.$apply();
			});
		}
	};
}]);

wikiApp.filter('titleCase', function() {
  return function(input) {
    input = input || '';
    return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
});
