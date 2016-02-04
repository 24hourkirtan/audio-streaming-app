angular.module('starter.services', [])
.factory('streamService', function($http, $q){

    var streamUrl = 'http://icecast.24hourkirtan.fm:8000/128k.mp3';
    var metadataUrl = 'http://24hourkirtan.fm/wp-content/plugins/wp_nativeflashradio3/js/currentsong.php?url=' + streamUrl;
    var contentRegex = /<body>(.*)<\/body>/;
    var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
    var resolutionRegex = /100x100/;

    var service = {
      getStreamInfo: getStreamInfo
    };
    return service;
    // ***************************************************************************
    function getStreamInfo() {
      myobject = { url: streamUrl };        
      Object.toparams = function ObjecttoParams(obj) 
      {
        var p = [];
        for (var key in obj) 
        {
          p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
      };

      var req = 
      {
          method: 'POST',
          url: metadataUrl,
          data: Object.toparams(myobject),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }


      return $http(req).then(function(response) {
        console.log(response);
        return {
          title: response.data
        };
        /*
        var title = parseShoutcastResponse(response.data);
        if (!title) {
          return {};
        }
        return getCover(title).then(function(coverUrl) {
          return {
            title: title,
            coverUrl: coverUrl
          };
        });
        */
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
});
