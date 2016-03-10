<div class="page-header">
  <h1  id="page-title">Releases > Android</h1>
</div>

Detailed instructions on how to prepare a build releases for Android. CLI commands are MAC or Linux based. Windows users must adjust syntax.

___
### Update the config.xml file
A few attributes need to be verified prior to creating a release build by adjusting the version number and version-code. If the version-code is not set the SDK build will create one based on the version number. Be sure that the (id) in the widget element is correctly set and has not been changed.

Set attributes in the widget element.
```json
version ="0.8.0"

id="com.ionicframework.kirtanradio392459"
```


Verify the proper minSDK is present. Currently the targetSDK is not set and will default to 23 in the AndroidManifest.xml file, change it if needed.
```html
&lt;preference name="android-minSdkVersion" value="16"/>
// Optional android-targetSdkVersion
&lt;preference name="android-targetSdkVersion" value="&lt;number>"/>
```

___  
### Update package.json file
The build does not reference the version number in the package.json file but it should be changed so the GitHub tag for the release includes the proper package.json.version.
```xml
version="0.8.0"
```


___  
### Run the build --release command
The following command will create an unsigned APK file in ~/Development/ionic-audio-streaming/platforms/android/build/outputs/apk/android-release-unsigned.apk
```none
ionic build android --release
```

Verify the proper settings appear in the AndroidManifest.xml file under platforms > android.
```yaml
android:versionCode="800" android:versionName="0.8.0"

uses-sdk android:minSdkVersion="16" android:targetSdkVersion="23"
```

___  
### Signing Key
This step only needs to be performed once. The key that is created can be used for each release. Once this key has been used to deploy to the Play Store it cannot be changed.

Move to the directory to store the key in.
```
cd ~/Development/24_keystore
```

Run the keytool program. A sample for the prompts is shown below.

```
keytool -genkey -v -keystore 24hourkirtan.keystore -alias 24hourkirtan -keyalg RSA -keysize 2048 -validity 10000
```


```bash
Enter keystore password:  <password>
Re-enter new password:  <password>
What is your first and last name?
  [Unknown]:  Nanda Kishor
What is the name of your organizational unit?
  [Unknown]:  Research and Development
What is the name of your organization?
  [Unknown]:  24 Hour Kirtan Radio
What is the name of your City or Locality?
  [Unknown]:  Zurich
What is the name of your State or Province?
  [Unknown]:  Zurich
What is the two-letter country code for this unit?
  [Unknown]:  CH
```  

___  
### Sign the APK file
Move to the root of the ~/24_keystore directory and move a copy of android-release-unsigned.apk into it.



```bash
cd ~/Development/24_keystore
cp ~/Development/ionic-audio-streaming/platforms/android/build/outputs/apk/android-release-unsigned.apk android-release-unsigned.apk
```

<br/>
___

### Run jarsigner
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore 24hourkirtan.keystore android-release-unsigned.apk 24hourkirtan
```

<br/>
___
### Create the new APK
```bash
~/Development/android-sdk-macosx/build-tools/22.0.1/zipalign -f -v 4 android-release-unsigned.apk 24HourKirtan.apk
```

(Optional) Cowboy test the APK file on desired Android devices. Attach the APK file to an email for quick install.

___
### Create GitHub Release
See the document: Releases > [GitHub Release](index.html?md=pages_builds_github-release.md).

___
### Play Store
See the document: Releases > [Play Store](index.html?md=pages_builds_playstore.md).

---------
