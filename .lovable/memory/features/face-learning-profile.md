---
name: Face Learning Profile
description: Users upload 3-5 selfies from different angles; AI uses them as face references during generation for better identity preservation
type: feature
---
- Storage bucket: `face-references` (private, RLS per user)
- DB table: `face_references` (user_id, storage_path)
- FaceProfileScreen: grid upload UI, max 5 selfies, tips for angle variety
- LoadingScreen fetches signed URLs and passes `faceReferenceUrls` to edge function
- Edge function passes up to 3 face references as additional image_url content parts
- Face ref directive appended to facePreservation prompt when refs are available
- Accessible from Profile > "My Face Profile" (requires sign-in)
