#Open Source Audio Streaming App

We're an Internet radio station in the process of building an open source mobile audio streaming app that can be used by anyone who wants to create their own Spotify-like app. The idea is to use the advanced [Ionic](http://ionicframework.com) HTML5 hybrid mobile app framework to create both an Android and iOS app based on the same code.

As an Internet radio station we're already providing an audio stream with 128k and 64k which can be listened to on a desktop computer, smart phone or Internet radio player. In our case the technology used for the Internet radio stream is [Icecast](http://icecast.org/) (streaming media server) and [Liquidsoap](http://liquidsoap.fm/) (streaming source client) both of which is also free open source software licensed under the GNU General Public License version 2.0 (GPLv2).

##Default Streaming Mode

The new open source Ionic audio streaming app will be able to play an Icecast (and probably also Shoutcast) audio stream which is a similar listener experience you might know from apps like [TuneIn](http://tunein.com/). If your streaming server offers more than one bandwidth like ours, the app will auto-select the most suitable stream quality according to the users available bandwidth, so that it's possible to also stream on mobile networks with 4G, 3G or even (a stable) Edge connection.

##Custom Streaming Mode

The app will also allow listeners to stream their custom playlist based on their favorite tracks, albums or artists. Listening to those tracks offline might also be a nice feature for a later version of the app.

##Roadmap

* Version 0.8.0 (Alpha) to be released on February 19, 2016
* Version 0.9.0 (Beta) to be released on March 23, 2016
* Version 1.0.0 (Stable) to be discussed

##Wiki

Some of the information of this README might be transferred to our [wiki](https://github.com/24hourkirtan/ionic-audio-streaming/wiki).

#Installation

Run the following commands first:
<code>cordova plugin add https://github.com/keosuofficial/cordova-audio-stream-plugin.git</code>
<code>cordova plugin add cordova-plugin-network-information</code>

Run the following additional commands for the respective platform:

<h2> Android</h2>
<code>cordova platform add android@5.0.0<br>
cordova plugin add cordova-plugin-fullscreen<br>
cordova build android</code>

To test, run:
<code>cordova run android</code>

<h2>iOS</h2>
<code>cordova platform add ios<br>
cordova build ios</code>

To test, open the Xcode project in the "platforms/ios" project folder and deploy it to a test device or emulator.

##License

This project is licensed under the GNU General Public License version 2.0 (GPLv2). For more information, see the LICENSE file in this repository. As Ionic itself is licensed under the MIT Open Source license we will have to verify how these two licenses are compatible with each other.