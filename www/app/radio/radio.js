angular.module('app.radio', [])
.controller('RadioCtrl', function($interval, $ionicLoading, streamService, $cordovaNetwork, $scope, $rootScope, $stateParams, ui, AudioFactory) {
  var streamUrl;
  var iosTimer;

  var isHighBandwidth = function(){
    return $cordovaNetwork.getNetwork() == Connection.CELL_4G ||
        $cordovaNetwork.getNetwork() == Connection.ETHERNET || 
        $cordovaNetwork.getNetwork() == Connection.WIFI;
  };

  document.addEventListener("deviceready", function () {

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      //ui.showToast("Device is online! Press play to resume listening.");
      vm.isPlaying = true;
      streamUrl.online = true;
      play();
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      ui.showToast("Device is offline!");
      vm.isPlaying = false;
      streamUrl.online = false;
      AudioFactory.pause();

      if(MusicControls)
        MusicControls.updateIsPlaying(false);
    })

    streamUrl = {
      hiFiMode: isHighBandwidth() ? true : false,
      hiFi: stream.hiFi,
      loFi: stream.loFi,
      online: true
    };

    // Initialization
    AudioFactory.init(streamUrl.hiFiMode ? streamUrl.hiFi : streamUrl.loFi);
  }, false);

  // Periodically check internet connection type and switch icecast server if changed
  var connectionTimer = $interval(function() {
      if(streamUrl.online){
        if(isHighBandwidth()){
          if(streamUrl.hiFiMode == false){
            ui.showToast("Switching to high-bandwidth mode...");
            streamUrl.hiFiMode = true;
            if(vm.isPlaying){
              AudioFactory.stop();
              AudioFactory.init(streamUrl.hiFi);
              play();
            }
          }
        } else {
          if(streamUrl.hiFiMode == true){
            ui.showToast("Switching to low-bandwidth mode...");
            streamUrl.hiFiMode = false;
            if(vm.isPlaying){
              AudioFactory.stop();
              AudioFactory.init(streamUrl.loFi);
              play();
            }
          }
        }
      }
  }, 5000);

  var vm = angular.extend(this, {
    togglePlay: function(){
      if (vm.isPlaying)
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
	  vm.isPlaying = true;
	  getStreamInfo();
    timer = $interval(function() {
      getStreamInfo();
    }, 5000);
  }

  function pause() {
    vm.info = null;
    vm.isPlaying = false;
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

  function getStreamInfo() {
    streamService.getStreamInfo().then(function(info) {
      vm.info = info;
      if(vm.info.title){
        var elem = document.createElement('textarea');
        elem.innerHTML = vm.info.title;
        vm.info.title = elem.value;

        var details = vm.info.title.split('-');

        track = details.length > 1 ? details[0] : vm.info.title;
        artist = details.length > 1 ? details[1] : "";
        album = "";
        image = "https://s3.amazonaws.com/strollio/art.jpg";
        duration = 0;
        elapsedTime = 0;
        
        var params = [artist, track, album, image, duration, elapsedTime];

        if($scope.title != vm.info.title){
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

	    $scope.title = vm.info.title;
      }
    }, function() {
      vm.info = null;
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
});