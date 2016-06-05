angular.module('app.playlist', [])
.controller('PlaylistListCtrl', function($scope, $rootScope, $stateParams, $http, ui, localStorage, $ionicPopup) {

	$scope.$on('$stateChangeSuccess', function() {
		if(!$rootScope.user){
			$scope.playlists = localStorage.getArray('playlists');
		}
		else{
			ui.showToast("Loading...");
			$http.get(API_URL + "/playlists").then(function(response){
				$scope.playlists = response.data;
				ui.hideToast();
			});
		}
	 });

	$scope.delete = function(playlist){
		var confirmPopup = $ionicPopup.confirm({
		     title: 'Are you sure you want to delete this playlist?'
		});

		confirmPopup.then(function(res) {
			 if(res) {
				for(var i = 0; i < $scope.playlists.length; i++){
					if($scope.playlists[i].name == playlist.name){
						$scope.playlists.splice(i, 1);
						break;
					}
				}
				localStorage.setArray("playlists", $scope.playlists);
			 } 
		});
	};

	// Triggered on a button click, or some other target
	$scope.showAddPrompt = function() {
	  $scope.playlist = {
	  	"name": "",
	  	"mp3s": []
	  };

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="playlist.name">',
	    title: 'Enter playlist name',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel', onTap: function(e) { return false; } },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.playlist.name) {
	            e.preventDefault();
	          } else {
	            return $scope.playlist.name;
	          }
	        }
	      }
	    ]
	  }).then(function(name) {
	  	if(name){
		    if(!$rootScope.user){
	      		if(localStorage.hasArrayKeyValue($scope.playlists, "name", name))
	      			ui.showToast("A playlist with this name already exists!");
	      		else{
	      			$scope.playlists.push($scope.playlist);
	      			localStorage.setArray("playlists", $scope.playlists);
	      		}
	      	}
	      	else{
				$http.post(API_URL + "/playlist", $scope.playlist).then(function(response){
					$scope.playlists = response.data;
					ui.hideToast();
				});
	      	}
	      }
	  });

	 };
});