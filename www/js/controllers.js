angular.module('starter.controllers', [])
.controller('StreamController', function($interval, streamService, $cordovaNetwork, $rootScope, UtilitiesFactory) {

  var streamUrl = {
    hiFiMode: true,
    hiFi: 'http://icecast.24hourkirtan.fm:8000/128k.mp3',
    loFi: 'http://icecast.24hourkirtan.fm:8000/64k.mp3'
  };

  var isPlaying = false;
  var stream;
  var timer;

  // Periodically check internet connection type and switch icecast server if changed
  var connectionTimer = $interval(function() {
      if($cordovaNetwork.getNetwork() == Connection.CELL_4G ||
        $cordovaNetwork.getNetwork() == Connection.ETHERNET || 
        $cordovaNetwork.getNetwork() == Connection.WIFI){
        if(streamUrl.hiFiMode == false){
          UtilitiesFactory.showToast("Switching to high-bandwidth mode...");
          streamUrl.hiFiMode = true;
          if(vm.isPlaying){
            pause();
            play();
          }
        }
      } else {
        if(streamUrl.hiFiMode == true){
          UtilitiesFactory.showToast("Switching to low-bandwidth mode...");
          streamUrl.hiFiMode = false;
          if(vm.isPlaying){
            pause();
            play();
          }
        }
      }
  }, 5000);

  var vm = angular.extend(this, {
    togglePlay: togglePlay,
    isPlaying: isPlaying,
    info: null
  });
  // *********************************************************************
  function togglePlay() {
    if (vm.isPlaying) {
      pause();
    } else {
      play();
    }
    vm.isPlaying = isPlaying = !isPlaying;
  }

  function play() {
    if (window.Stream) {
      stream = new window.Stream(streamUrl.hiFiMode ? streamUrl.hiFi : streamUrl.loFi);
      // Play audio
      stream.play();
    }
    getStreamInfo();
    timer = $interval(function() {
        getStreamInfo();
    }, 5000);
  }

  function pause() {
    vm.info = null;
    $interval.cancel(timer);
    if (!stream) {
      return;
    }
    stream.stop();
  }

  function getStreamInfo() {
    streamService.getStreamInfo().then(function(info) {
      vm.info = info;
    }, function() {
      vm.info = null;
    });
  }

  document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork()

      var isOnline = $cordovaNetwork.isOnline()

      var isOffline = $cordovaNetwork.isOffline()


      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        UtilitiesFactory.showToast("Device is online! Press play to resume listening.");
        //vm.isPlaying = true;
        //play();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        UtilitiesFactory.showToast("Device is offline!");
        vm.isPlaying = false;
        pause();
      })

    }, false);
});
