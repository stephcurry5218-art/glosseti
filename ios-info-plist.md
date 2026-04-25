# iOS Info.plist — Required Permission Strings & URL Schemes

After running `npx cap add ios` (or after `npx cap sync ios`), open
`ios/App/App/Info.plist` in Xcode and confirm these keys exist between the
top-level `<dict>` tags. **Without them iOS will crash the moment the user
taps "Take Photo" or "Choose from Library", and Apple will reject the build.**

```xml
<key>NSCameraUsageDescription</key>
<string>Glosseti uses the camera so you can take a selfie or full-body photo for AI styling.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Glosseti needs access to your photos so you can pick an existing selfie or outfit photo for AI styling.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Glosseti saves your generated styled looks to your Photos so you can keep or share them.</string>
```

## Google Sign-In URL Scheme (REQUIRED for native Google login)

The native Google Sign-In SDK requires the **reversed** iOS client ID to be
registered as a URL scheme. Without this, the Google login sheet will open
but never return to the app.

Add the following block to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.397756734481-noqav0d4im5v9r8bkrgqntrcucn9u5po</string>
        </array>
    </dict>
</array>
```

If `CFBundleURLTypes` already exists (e.g. for Sign in with Apple or another
deep link), **append** another `<dict>` entry inside the existing `<array>`
rather than duplicating the key.

The matching iOS client ID is configured in `capacitor.config.ts` under
`plugins.GoogleAuth.iosClientId` and is:
`397756734481-noqav0d4im5v9r8bkrgqntrcucn9u5po.apps.googleusercontent.com`

If you support Sign in with Apple, also confirm in Xcode → **Signing &
Capabilities** that the **Sign in with Apple** capability is added. There is
no Info.plist entry for it; it lives in the entitlements file.

## Verifying on iPad before submitting

1. Open `ios/App/App.xcworkspace` in Xcode.
2. Pick an **iPad Air 11-inch (M3)** or **iPad Pro 13-inch (M4)** simulator.
3. Run the app. The shell should appear letterboxed (centered phone-width
   column on dark background) — not stretched to the full iPad width.
4. Tap a feature that needs the camera/photos. The first tap should show the
   blue iOS permission prompt with the strings above. Allow → picker opens.
5. Background the app, go to **Settings → Glosseti → Photos → None**, return
   to the app, tap the photo button again. You should see the toast message
   asking you to re-enable in Settings (no crash).
6. Tap **Sign in with Google**. The native Google account picker should
   appear. Pick an account → app returns and you land signed in.

If any of those steps fail, do not submit to App Review.
