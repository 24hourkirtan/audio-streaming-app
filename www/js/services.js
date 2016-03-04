angular.module('starter.services', [])
.factory('streamService', function($http, $q){

    var streamUrl = 'http://icecast.24hourkirtan.fm:8000/128k.mp3';
    var metadataUrl = 'http://icecast.24hourkirtan.fm:8000/status-json.xsl';
    var contentRegex = /<body>(.*)<\/body>/;
    var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
    var resolutionRegex = /100x100/;

    var service = {
      getStreamInfo: getStreamInfo
    };
    return service;
    // ***************************************************************************
    function getStreamInfo() {
      return $http.get(metadataUrl).then(function(response) {
        console.log(response);
        return response.data.icestats.source[0];
      });
    }

    function getCover(title) {
      return $http.get(itunesSearchUrl + title).then(function(response) {
        var item = response.data.results[0];
        if (!item || !item.artworkUrl100) {
          return null;
        }
        return item.artworkUrl100.replace(resolutionRegex, '500x500');
      });
    }

    function parseShoutcastResponse(html) {
      var content = html.match(contentRegex)[1];
      var parts = content.split(',');
      if (parts.length < 7 || !parts[6]) {
        return null;
      }
      return parts[6];
    }
})
.factory('AudioFactory',
  function($q, $rootScope){
  
  var media;
  var state = {
    playing: false,
    volume: 100
  };

  return {
    playAudio: function(path) {

      var cb = {
        success: function(){
          console.log("playAudio():Audio Success");
        },
        error: function(err){
          console.log("playAudio():Audio Error: "+ err.code);
        },
        status: function(status){
          $rootScope.$broadcast("status", status);
        }
      };

      var deferred = $q.defer();
     
        this.stopAudio();

        if(ionic.Platform.isIOS() && window.Stream){
          media = new window.Stream(path, cb.success, cb.error, cb.status);
        }
        else if(Media){
         media = new Media(path, cb.success, cb.error, cb.status);
        }
        media.play();
        state.playing = true;
        deferred.resolve();
      return deferred.promise;
    },
    stopAudio: function() {
      var deferred = $q.defer();
      if(media){
        media.stop();
        media.release();
        $rootScope.$broadcast('stopped');
      }
      deferred.resolve();
      return deferred.promise;
    },
    pause: function() {
      state.playing = false;
      if(media) media.pause();
    },
    resume: function(){
      state.playing = true;
      if(media) media.play();
    }
  };
});