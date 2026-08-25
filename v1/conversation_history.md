# Project Development History: RTU AR Wall of Fame

This file serves as a record of the AI-assisted development process for the **RTU AR Wall of Fame** application.

## Initial Concept & Architecture
* **Goal:** Create a location-based WebAR "Wall of Fame" for the Riga Technical University (RTU) hall to display hackathon winners.
* **Challenge Identified:** Pure GPS tracking (`AR.js` GPS entities) is highly unreliable for indoor, wall-anchored AR due to severe sensor drift and lack of indoor GPS precision.
* **Solution Architecture:** 
  We adopted a **Hybrid GPS + Manual Anchor** approach:
  1. Use coarse browser GPS (`navigator.geolocation`) to verify the user is physically within the general "Zone" (the university hall).
  2. Use a manual UI button ("Deploy Wall") to spawn the AR screen perfectly flat in front of the user's camera, bypassing the need for physical QR markers or precise indoor coordinates.

## Iteration 1: The Prototype
* Set up an A-Frame 3D scene (`index.html`).
* Designed a "glassmorphism" UI overlay that acts as a calibration/initialization Heads-Up Display (HUD).
* Extracted RTU's real-world coordinates and set them up inside a local `data.json` file to serve as a lightweight CMS.
* Tested the local python HTTP server, realizing that WebAR requires HTTPS to access the mobile camera (requiring deployment or `ngrok`).

## Iteration 2: "Iron Man Jarvis" Aesthetic Overhaul
* **Feedback:** The initial AR cards were too bulky, blocked the camera feed, and lacked responsiveness. The background was completely black because the webcam feed was disabled.
* **Fixes Applied:**
  * Re-enabled the `AR.js` webcam background to show the real world behind the UI.
  * Rebuilt the cards using transparent dark-blue glass, thin glowing cyan (`#00e5ff`) borders, and a monospace font (`Monoid` / `Share Tech Mono`).
  * Drastically scaled down the dimensions of the cards to fit nicely on mobile screens.

## Iteration 3: Physics & True Hologram Tweaks
* **Feedback:** The UI felt like a cheap copy, the text overlapped, dragging the screen was unintuitive, and pinching to scale was broken. The UI also spawned tilted/skewed depending on the user's initial orientation.
* **Final Polish:**
  * **Billboarding:** Wrote a custom `billboard-y` component. The AR screen now automatically rotates on its Y-axis to dynamically face the user's camera at all times, making it a perfect 2D hologram.
  * **Hologram Grid:** Replaced solid translucent backgrounds with 1px thick A-Frame wireframe grids (`wireframe: true`).
  * **Responsive Typography:** Refactored text rendering with proper `baseline`, `line-height`, and strict character-wrapping to prevent long descriptions from colliding with titles.
  * **True Perspective Dragging:** Rewrote the math for dragging so that sliding a finger left/right moves the wall along the camera's *local* X/Y axes, rather than global coordinates.
  * **Pinch-to-Scale Fix:** Bound touch events globally to `document` to bypass A-Frame's canvas swallowing, removed artificial dampening, and injected `e.preventDefault()` to stop native browser zooming.

## Final Deployment
* Initialized the local project as a Git repository.
* Pushed via GitHub CLI to the `deconsulent` public repository: [https://github.com/deconsulent/RTU-Wall-of-Fame](https://github.com/deconsulent/RTU-Wall-of-Fame).
* The application is now ready for deployment to GitHub Pages to enable the HTTPS protocol required for smartphone camera access.
