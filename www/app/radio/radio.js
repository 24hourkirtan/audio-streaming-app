angular.module('app.radio', [])
.controller('RadioCtrl', function($interval, $ionicLoading, streamService, $cordovaNetwork, $scope, $rootScope, $stateParams, ui, AudioFactory) {
  var iosTimer, streamUrl;

  var isHighBandwidth = function(){
    return $cordovaNetwork.getNetwork() == Connection.CELL_4G ||
        $cordovaNetwork.getNetwork() == Connection.ETHERNET || 
        $cordovaNetwork.getNetwork() == Connection.WIFI;
  };

  document.addEventListener("deviceready", function () {
    // Initial bandwidth check
    streamUrl = {
      hiFiMode: isHighBandwidth() ? true : false,
      hiFi: stream.hiFi,
      loFi: stream.loFi
    };

    // Initialization
    AudioFactory.init(streamUrl.hiFiMode ? streamUrl.hiFi : streamUrl.loFi);
  }, false);

  var vm = angular.extend(this, {
    togglePlay: function(){
      if ($rootScope.isPlaying)
        pause();
      else
        play();
    },
    isPlaying: false,
    info: null,
    paused: false
  });

  var timer;
  var loading = false;

	$scope.$on('status', function(event, status){
    console.log("Status",status); 
    	$scope.$apply(function(){
	    	if(status == Media.MEDIA_STARTING){
	    		//$scope.state.status = "Loading audio...";
	    		ui.showToast("Loading...", 0);
          loading = true;
	    	}
	    	else if(status == Media.MEDIA_RUNNING){
	    		//$scope.state.status = "Playing...";
	    		ui.hideToast();
          loading = false;
	    	}
	    	else if(status == Media.MEDIA_STOPPED){
		    	//$scope.state.status = "Stopped.";
          loading = false;
	    	}
    	});
    });

  function play() {
    if((ionic.Platform.isIOS() && !vm.paused) || !AudioFactory.isRadio){
      //ui.showToast("Loading...", 0);
      AudioFactory.init(streamUrl.hiFiMode ? streamUrl.hiFi : streamUrl.loFi);
      if(!AudioFactory.isRadio)
    	AudioFactory.stop();
    }
    
    AudioFactory.play(true);
    vm.paused = false;
	  $rootScope.isPlaying = true;
	  getStreamInfo();
    timer = $interval(function() {
      getStreamInfo();
    }, 5000);
  }

  function pause() {
    $rootScope.song = null;
    $rootScope.isPlaying = false;
    $ionicLoading.hide();
    $interval.cancel(timer);
    AudioFactory.pause();
    vm.paused = true;

    if(ionic.Platform.isIOS()){
      iosTimer = $interval(function(){
        AudioFactory.stop();
        vm.paused = false;
        $interval.cancel(iosTimer);
      }, 30000);
    }
  }

  function checkBandwidth() {
      if($rootScope.online){
        if(isHighBandwidth()){
          if(streamUrl.hiFiMode == false){
            ui.showToast("Switching to high-bandwidth mode...");
            streamUrl.hiFiMode = true;
            if($rootScope.isPlaying){
              AudioFactory.stop();
              AudioFactory.init(streamUrl.hiFi);
              play();
            }
          }
        } else {
          if(streamUrl.hiFiMode == true){
            ui.showToast("Switching to low-bandwidth mode...");
            streamUrl.hiFiMode = false;
            if($rootScope.isPlaying){
              AudioFactory.stop();
              AudioFactory.init(streamUrl.loFi);
              play();
            }
          }
        }
      }
  }

  function getStreamInfo() {
    streamService.getStreamInfo().then(function(info) {
      $rootScope.song = info;
      if($rootScope.song.title){
        var elem = document.createElement('textarea');
        elem.innerHTML = $rootScope.song.title;
        $rootScope.song.title = elem.value;

        var details = $rootScope.song.title.split('-');

        track = details.length > 1 ? details[0] : $rootScope.song.title;
        artist = details.length > 1 ? details[1] : "";
        album = "";
        image = "https://s3.amazonaws.com/strollio/art.jpg";
        duration = 0;
        elapsedTime = 0;
        
        var params = [artist, track, album, image, duration, elapsedTime];

        if($scope.title != $rootScope.song.title){
	        if(ionic.Platform.isIOS()){
		        window.remoteControls.updateMetas(function(success){
		            console.log(success);
		        }, function(fail){
		            console.log(fail);
		        }, params);
	        }
	        else{
	        	MusicControls.create({
				    track       : track,        // optional, default : ''
				    artist      : artist,                       // optional, default : ''
				    cover       : image,      // optional, default : nothing
				    isPlaying   : true,                         // optional, default : true
				    dismissable : true,                         // optional, default : false

				    // hide previous/next/close buttons:
				    hasPrev   : false,      // show previous button, optional, default: true
				    hasNext   : false,      // show next button, optional, default: true
				    hasClose  : true,       // show close button, optional, default: false

				    // Android only, optional
				    // text displayed in the status bar when the notification (and the ticker) are updated
				    ticker    : 'Now playing ' + track
	    		}, function(success){
	    				//console.log(success);

	    				function events(action) {
	    				    switch(action) {
	    				        case 'music-controls-next':
	    				            // Do something
	    				            break;
	    				        case 'music-controls-previous':
	    				            // Do something
	    				            break;
	    				        case 'music-controls-pause':
	    				            pause();
	    				            MusicControls.updateIsPlaying(false);
	    				            break;
	    				        case 'music-controls-play':
	    				            play();
	    				            MusicControls.updateIsPlaying(true);
	    				            break;
	    				        case 'music-controls-destroy':
	    				            // Do something
	    				            break;
	    				        // Headset events (Android only)
	    				        case 'music-controls-media-button' :
	    				            // Do something
	    				            break;
	    				        case 'music-controls-headset-unplugged':
	    				            // Do something
	    				            break;
	    				        case 'music-controls-headset-plugged':
	    				            // Do something
	    				            break;
	    				        default:
	    				            break;
	    				    }
	    				}

	    				MusicControls.subscribe(events);
	    				MusicControls.listen();
	    			}, function(error){
	    				console.log(error);
	    			});
	        }
	    }

	    $scope.title = $rootScope.song.title;
      }
    }, function() {
      $rootScope.song = null;
    });
  }

	//listen for the event
  if(ionic.Platform.isIOS()){
  	document.addEventListener("remote-event", function(event) {
  		if(event.remoteEvent.subtype == "pause")
        pause();
      else if(event.remoteEvent.subtype == "play")
        play();
  	});
  }

  // Periodically check internet connection type and switch icecast server if changed
  var connectionTimer = $interval(checkBandwidth, 5000);

  $rootScope.$on('$stateChangeStart', 
  function(event, toState, toParams, fromState, fromParams){ 
    if(fromState.name == "app.radio"){
      if (timer) {
        $interval.cancel(timer);
      }

      if(iosTimer){
        $interval.cancel(iosTimer);
      }

      if(connectionTimer){
        $interval.cancel(connectionTimer);
      }
    }
    else if(toState.name == "app.radio"){
      connectionTimer = $interval(checkBandwidth, 5000);
    }
  });
});