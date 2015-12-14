wikiApp.controller('mainController',['$scope','adminService','$window','$location','fileUpload','$filter','$cookies','$cookieStore','$route',function($scope,adminService,$window,$location,fileUpload,$filter,$cookies,$cookieStore,$route){
	console.log('you are in main controller');
	
	function init(){
		$scope.authUser	=	$cookieStore.get('authUser');
		$scope.myFile	=	{};
		var secs = parseInt($('#expsecs').val(), 10);
		$scope.hostName = $location.host();
		
		$scope.arrayNum	=	[];
		for(var i=1;i<100;i++){
			$scope.arrayNum.push(i);
		}
		if (isNaN(secs)) {
			secs = 5;
		}
		var now = new Date();
		$scope.exp = new Date(now.getTime() + secs*1000);
		$scope.colorPalette	=	['#ffff99','#99ffcc','#ffcc99','#6fb352','#e68a8e','#8ae6df','#b8b35e','#a19bf2','#8de09f','#5fb071','#b05f91','#ab7560'];
		function loadData(){
			var promise	=	adminService.getSiteConfig();
			promise.then(
				function(result){
					angular.forEach(result.data,function(item){
						if(item.active	==	true){
							$scope.siteConfig	=	item;
						}
					});
				}
			);
			
			var promise	=	adminService.getActiveCategories();
			promise.then(
				function(result){
					$scope.categories	=	[];
					$scope.categories	=	result.data;
				}
			);
		}
		loadData();
		
		$scope.$on('refreshParent',function(){
			loadData();
		});
		
		$scope.link	=	function(url){
			console.log(url);
			$location.path(url);
		}
		
		$scope.setDefaultImage	=	function(){
			return "noimage.png";
		}
		
		//an array of files selected
		$scope.files = [];

		//listen for the file selected event
		$scope.$on("fileSelected", function (event, args) {
			//$scope.files.push(args.file);
			console.log(args);
			$scope.$apply(function () {            
				$scope.files.push(args.file);
				var file = args.file;
				var uploadUrl = "/api/upload";
				console.log('hello');
				var promise	=	fileUpload.uploadFileToUrl(file, uploadUrl);
				promise.then(
					function(result){
						console.log(result.data.file.name+'uploaded');
						$scope.$broadcast(args.model,{ fileName: result.data.file.name});
					}
				)
			});
			
		});
		
		$scope.getNumber = function(num) {
			return new Array(num);   
		};
		
		$scope.userLogin	=	function(){
			$scope.newAuthUser.lid	=	$filter('lowercase')($scope.newAuthUser.lid);
			var promise	=	adminService.checkUserLogin($scope.newAuthUser);
			promise.then(
				function(result){
					if($filter('lowercase')(result.data.lid)	==	$filter('lowercase')($scope.newAuthUser.lid)	&&	result.data.active	==	true){
						$('#loginPopup').modal('hide');
						$cookieStore.put('authUser', result.data,{ expires: 1 });
						$scope.authUser	=	$cookieStore.get('authUser');
					}else if($filter('lowercase')(result.data.lid)	==	$filter('lowercase')($scope.newAuthUser.lid)	&&	result.data.active	==	false){
						$scope.alertMsgType	=	2;
						$scope.alertMsg	=	'<p class="pull-left">Please check with Adminstrator to activate your account..</p>'
					}else{
						$scope.alertMsgType	=	2;
						$scope.alertMsg	=	'<p class="pull-left">Username or Password mismatch</p>'
					}
					$scope.cookieStore	=	$cookieStore;
				}
			);			
		};
		
		$scope.logout	=	function(){
			$cookieStore.put('authUser', null);
			$scope.authUser	=	null;
			$route.reload();
		};
		
		$scope.checkUser	=	function(newUser){
			if(newUser){
				if(newUser.name	==	''	||	newUser.name	==	null){
					return true;
				}
				
				if(newUser.lid	==	''	||	newUser.lid	==	null){
					return true;
				}
				if(newUser.password	==	''	||	newUser.password	==	null){
					return true;
				}
				return false;
			}return true;
		};
		
		$scope.openRegisterPopup	=	function(){
			$scope.newUser	=	{name:'',lid:'',password:''};
			$scope.alertMsg	=	'';
			$('#loginPopup').modal('hide');
			$('#registerPopup').modal('show');
		};
		
		$scope.openLoginPopup	=	function(){
			$scope.newAuthUser	=	{};
			$scope.alertMsg	=	'';
			$('#registerPopup').modal('hide');
			$('#loginPopup').modal('show');
		};
		$scope.createGuestUser	=	function(){
			if(!$scope.newUser.avatar){
				$scope.newUser.avatar	=	$scope.setDefaultImage();
			}
			$scope.newUser.lid	=	$filter('lowercase')($scope.newUser.lid);
			
			var promise	=	adminService.getUserByLId($scope.newUser.lid);
			promise.then(
				function(result){
					console.log(result.data);
					if(result.data.lid	==	$scope.newUser.lid){
						$scope.newUser	=	{};
						$scope.alertMsgType	=	2;
						$scope.alertMsg	=	'<p class="pull-left">Lid is already exists..</p> <p class="pull-left">If you forgot the password ask the administrator to reset the password.</p>'
					}else{
						$scope.alertMsg	=	"";
						var promise	=	adminService.createGuestUser($scope.newUser);
						promise.then(
							function(result){
								$scope.newUser	=	{};
								$scope.alertMsgType	=	1;
								$scope.alertMsg	=	'<p class="pull-left">Your Account Has Created Successfully.. </p>';
							}
						);
					}
				}
			);
		};
		
		$scope.fileIcon	=	function(fileName){
			var nameArray	=	fileName.split('.');
			var docIcon	=	"";
			if(nameArray[1]	==	'txt'){
				docIcon	=	"text.png";
			}
			
			if(nameArray[1]	==	'doc' ||	nameArray[1]	==	'docx'){
				docIcon	=	"word.png";
			}
			
			if(nameArray[1]	==	'xls' ||	nameArray[1]	==	'xlsx'){
				docIcon	=	"excel.png";
			}
			
			if(nameArray[1]	==	'pdf'){
				docIcon	=	"pdf.png";
			}
			return docIcon;
		};
		
		$scope.fileName	=	function(fileName){
			var nameArray	=	fileName.split('.');
			var docName	=	"";
			return $filter('limitTo')(nameArray[0], 6, 0)+'......('+ nameArray[1]+')';
		}
		
		$scope.showFileDeleteOption	=	function(fileName){
			if(fileName=='noimage.png'	||	fileName==""	||	fileName	==	null){
				return false;
			}else{
				return true;
			}
		}
		
		$scope.displayPage	=	function(page){
			console.log(page+'hello');
			if(page){
				return "<div>"+page.content+"</div>";
			}else{
				return "<h5>No content to display</h5>";
			}
			
		}
		
		$scope.getAttachments	=	function(attachments){
			angular.forEach(attachments,function(item){
				item.icon	=	$scope.fileIcon(item.name)
			});
			return attachments;
		};
		
		$scope.$on("userImgAvatar",function(event,args){
			if($scope.newUser.avatar){
				var oldimage	=	$scope.newUser.avatar;
				$scope.newUser.avatar	=	args.file;
				adminService.deleteFile(oldimage);
			}
			$scope.newUser.avatar	=	args.fileName;
		});
		
		$scope.getDate	=	function(date){
			return $filter('date')(date, 'dd/MM/yyyy');
		};
		
		
	}	
	
	init();
}]);