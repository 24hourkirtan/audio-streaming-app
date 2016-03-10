<div class="page-header">
  <h1  id="page-title">Releases > GitHub Release</h1>
</div>

After any release has been prepared for upload to the Play and App Stores a GitHub release
should be created to reflect a tagged point on the master branch.

___
### Commit master branch

Commit changes for the config.xml and package.json files before the tagged release.

```
$ git add config.xml
$ git add package.json
$ git commit =m "tagged release tag v0.8.0"
```

Verify file changes in the remote repository.


___
### Create GitHub release
The final APK and Archive (IPA) files now go to GitHub as a "tagged release".
Create a new tagged release on GitHub using previous release as a model. Add both the Android
and IOS files to the release.

* version format:  v0.0.0

<br/>
Attach a text file (ionic-info.txt0 showing the results of the ionic info command at the time of the build.

```none
$ ionic info  

Your system information:

Cordova CLI: 5.4.1
Gulp version:  CLI version 3.9.1
Gulp local:  
Ionic Version: 1.2.4
Ionic CLI Version: 2.0.0-beta.17
Ionic App Lib Version: 2.0.0-beta.8
ios-deploy version: 1.8.5
ios-sim version: 4.1.1
OS: Mac OS X El Capitan
Node Version: v4.2.0
Xcode version: Xcode 7.2.1 Build version 7C1002
```
