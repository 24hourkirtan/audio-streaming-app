// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'app.menu',
  'app.services',
  'ngCordova',
  'ui',
  'utils',
  'app.browse',
  'app.playlist',
  'app.radio'
])
.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {
    
    $ionicPlatform.registerBackButtonAction(function () {
        var confirmPopup = $ionicPopup.confirm({
         template: 'Are you sure you want to exit?',
         buttons: [
          { text: 'No' },
          {
            text: '<b>Yes</b>',
            type: 'button-assertive',
            onTap: function(e) {
              if(MusicControls){
                MusicControls.destroy(function(success){
                  console.log(success);
                }, function(error){
                  console.log(error);
                });
              }
              navigator.app.exitApp();
            }
          },
        ]
       });
    }, 101);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if ( ionic.Platform.isAndroid()){
        AndroidFullScreen.immersiveMode(function(){
          console.log("immersive mode on");
        }, function(){
          console.log("immersive mode off");
        });
    } else {
        ionic.Platform.fullScreen();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'app/menu2.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'app/search/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/browse.html'
        }
      }
  })
  .state('app.new_releases', {
      url: '/new_releases',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/new-release/list.html',
          controller: 'NewReleaseListCtrl'
        }
      }
    })
    .state('app.albums', {
      url: '/albums',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/album/list.html',
          controller: 'AlbumListCtrl'
        }
      }
    })
    .state('app.artists', {
      url: '/artists',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/artist/list.html',
          controller: 'ArtistListCtrl'
        }
      }
    })
    .state('app.years', {
      url: '/years',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/year/list.html',
          controller: 'YearListCtrl'
        }
      }
    })
    .state('app.songs', {
      url: '/songs/:key/:value',
      views: {
        'menuContent': {
          templateUrl: 'app/browse/song/list.html',
          controller: 'SongListCtrl'
        }
      }
    })
  .state('app.radio', {
      url: '/radio',
      views: {
        'menuContent': {
          templateUrl: 'app/radio/radio.html',
          controller: 'RadioCtrl as vm'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'app/playlist/list.html',
          controller: 'PlaylistListCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'app/playlist/detail.html',
        controller: 'PlaylistDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/radio');

  $ionicConfigProvider.scrolling.jsScrolling(true);

});