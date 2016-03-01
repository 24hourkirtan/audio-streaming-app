<div class="page-header">
  <h1  id="page-title">Releases > GitHub Release</h1>
</div>

After any release has been prepared for upload to the Play and App Stores a GitHub release
should be created to reflect a tagged point on the master branch.

___
### Commit master branch
The final APK and Archive (IPA) nows goes to GitHub as a "tagged release".
Commit changes for the config.xml and package.json files before the tagged release.

```
git add config.xml
git add package.json
git commit =m "tagged release tag v0.8.0"
```

Verify file changes in the remote repository.


___
### Create GitHub release

Create a new tagged release on GitHub using previous release as a model. Add both the Android and IOS files to the release.

* version format:  v0.0.0
