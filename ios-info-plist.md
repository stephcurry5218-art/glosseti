# iOS Info.plist — Required Permission Strings

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

If any of those steps fail, do not submit to App Review.
