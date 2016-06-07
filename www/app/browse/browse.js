angular.module('app.browse', [])
.controller('NewReleaseListCtrl', function($scope, $stateParams, $http, ui) {
	ui.showToast("Loading...");
	$http.get(API_URL + "/mp3s/distinctkey/releases").then(function(response){
		$scope.releases = response.data;
		ui.hideToast();
	});
})
.controller('AlbumListCtrl', function($scope, $stateParams, $http, ui) {
	ui.showToast("Loading...");
	$http.get(API_URL + "/mp3s/distinctkey/album").then(function(response){
		$scope.albums = response.data;
		ui.hideToast();
	});
})
.controller('ArtistListCtrl', function($scope, $stateParams, $http, ui) {
	ui.showToast("Loading...");
	$http.get(API_URL + "/mp3s/distinctkey/artist").then(function(response){
		$scope.artists = response.data;
		ui.hideToast();
	});
})
.controller('YearListCtrl', function($scope, $stateParams, $http, ui) {
	ui.showToast("Loading...");
	$http.get(API_URL + "/mp3s/distinctkey/year").then(function(response){
		$scope.years = response.data;
		ui.hideToast();
	});
})
.controller('SongListCtrl', function($scope, $rootScope, $stateParams, $http, ui, $timeout, localStorage, AudioFactory, $ionicLoading, $ionicPlatform) {

	$scope.state = {
		shuffle: false,
		isPlaying: false,
		changed: false,
		currentId: null,
		view: $stateParams.key,
		continue: true,
		jingled: false
	};

	$scope.togglePlay = function(){
		if(!$scope.state.currentId){
			$scope.state.currentId = 0;
			$scope.song = $scope.songs[0];
			AudioFactory.init(encodeURI($scope.song.dpath));
		}
		if($scope.state.isPlaying){
			$scope.state.continue = false;
			$scope.state.isPlaying = false;
			AudioFactory.pause();
		}
		else{
			$scope.state.continue = true;
			$scope.state.isPlaying = true;
      		AudioFactory.play();
		}
	};

	var mySound;

	$scope.play = function(song, $index){
		$scope.state.currentId = $index;
		$scope.state.continue = false;
		$scope.song = song;
		AudioFactory.init(encodeURI(song.dpath));
		AudioFactory.play();

		$scope.state.isPlaying = true;
		$scope.state.jingled = false;
	};

	$scope.$on('status', function(event, status){
    	$scope.$apply(function(){
	    	if(status == Media.MEDIA_STARTING){
	    		//$scope.state.status = "Loading audio...";
	    		$ionicLoading.show({
			      template: 'Loading...'
			    });
          		loading = true;
	    	}
	    	else if(status == Media.MEDIA_RUNNING){
	    		$scope.state.continue = true;
	    		//$scope.state.status = "Playing...";
	    		$ionicLoading.hide();
          		loading = false;
	    	}
	    	else if(status == Media.MEDIA_STOPPED){
		    	//$scope.state.status = "Stopped.";
          		loading = false;
          		if($scope.state.continue){
          			if(!$scope.state.jingled){
          	    		$ionicLoading.show({
					      template: 'Loading...'
					    });
					    loading = true;

          				$http.get(API_URL + "/jingle/random").then(function(response){
          					var jingle = response.data;
          					$scope.song = jingle;
          					AudioFactory.init(encodeURI(jingle.dpath));
          					AudioFactory.play();
							$ionicLoading.hide();
          					loading = false;
          					$scope.state.jingled = true;
						});
          			}
          			else{
          				$scope.state.jingled = false;
	          			if(!$scope.state.shuffle){
	          				if(++$scope.state.currentId >= $scope.songs.length)
	          					$scope.state.currentId = 0;
	          				AudioFactory.init($scope.songs[$scope.state.currentId].dpath);
	          				$scope.song = $scope.songs[$scope.state.currentId];
						}
						else{
							var index = Math.floor(Math.random() * $scope.songs.length);
							$scope.state.currentId = index;
							AudioFactory.init($scope.songs[index].dpath);
							$scope.song = $scope.songs[index];
						}
						AudioFactory.play();
					}
          		}
	    	}
    	});
    });

	$scope.title = $stateParams.value;
	var first = true;
	$scope.more = true;
	var next;

	$scope.loadMore = function(){
		// Playlist query
		if($stateParams.key == "playlist"){
			if(!$rootScope.user){
				$scope.ids = localStorage.getArrayObjectByKeyValue("playlists", "name", $stateParams.value).mp3s;

				$http({ method:'POST',
				        url: API_URL + "/mp3s/ids?image=false",
				        data:$scope.ids
				    })
				.then(
				    function successCallback(res) {
				        $scope.songs = res.data;
				    },
				    function errorCallback(res) {
				        //console.log(res);
				    }
				);
				$scope.title = $stateParams.value;
				$scope.more = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}
		else{
			// Non-playlist queries
			if(first && !next){
				$http.get(API_URL + "/mp3s/key/" + $stateParams.key + "?q="+$stateParams.value).then(function(response){
					$scope.songs = response.data.mp3s;
					next = response.data._next;
					first = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');

					$scope.more = response.data._remainingCnt;
				});
			}
			else{
				$http.get(API_URL + next).then(function(response){

					$scope.songs = $scope.songs.concat(response.data.mp3s);
					next = response.data._next;
					$scope.$broadcast('scroll.infiniteScrollComplete');

					$scope.more = response.data._remainingCnt;
				});
			}
		}
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	 });

	$scope.showAddToPlaylistModal = function($event, song){
		if($event){
	      $event.stopPropagation();
	      $event.preventDefault(); 
	    }

		$scope.song = song;
	    ui.showModal("./app/browse/song/add-modal.html", $scope); 
	    ui.hidePopover();
	};

	/*
	$scope.showAddModal = function(){
		console.log($scope.song);
	    ui.showModal("./app/browse/song/add-modal.html", $scope); 
	    ui.hidePopover();
	};

	$scope.showOptionsPopover = function($event, song){
		$scope.song = song;
		console.log($event);
		if($event){
	      $event.stopPropagation();
	      $event.preventDefault(); 
	    }
	  	ui.showPopover("./app/browse/song/options-popover.html", $scope, $event);
	};
	*/
})
.controller('SongPlaylistAddCtrl', function($scope, $rootScope, $stateParams, $http, ui, localStorage, $ionicPopup) {

	$scope.addToPlaylist = function(playlist){
		for(var i = 0; i < $scope.playlists.length; i++){
			if($scope.playlists[i].name == playlist.name){
				if($scope.playlists[i]["mp3s"].indexOf($scope.song._id) > -1){
					ui.showToast("This playlist already contains this song!", 2000);
					break;
				}
				else{
					$scope.playlists[i]["mp3s"].push($scope.song._id);
					localStorage.setArray("playlists", $scope.playlists);
					ui.hideModal();
					ui.showToast("Song added to playlist!", 2000);
					break;
				}
			}
		}
	};

	$scope.hideModal = function(){
		ui.hideModal();
	};

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
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.playlist.name) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
	            return $scope.playlist.name;
	          }
	        }
	      }
	    ]
	  }).then(function(name) {
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
	  });
	 };
});





