virtual coordinate based screen summary based on coordinates just through web create for like
winners of some hackathon!
I created a browser-based coordinate visualization page that shows hackathon winners as
virtual points placed on a screen from GPS-style coordinates, which matches your idea of a
web-only “virtual coordinate based screen summary” inspired by the AR placement concept.
The Instructables page itself was not accessible through the fetched page because it returned
an error/cookie wall, so I used your linked concept—placing objects from coordinates—and
turned it into a standalone interactive web demo instead.
The page simulates a viewer at a center location and projects winner markers onto a 2D stage
using relative latitude/longitude offsets, distance, and bearing, so it feels like a lightweight
coordinate-to-screen AR concept without needing a native mobile AR stack.
It includes:
A polished landing section for presenting winners.
An interactive coordinate stage with markers.
A winner list showing rank, distance, and direction.
A dark/light theme toggle.
Sample hackathon team data you can replace with real winners.
Open the shared HTML file in a browser and edit the winners array inside the script to replace
the placeholder teams with your real hackathon winners, categories, and coordinates. The
center point can also be changed to your event venue, campus, or demo location so the screen
layout reflects the real place you want to anchor the experience around.
https://www.instructables.com/Placing-AR-Objects-at-GP
S-Coordinates-in-Augmented/
What it does
How to use it

This works well for:
Hackathon winner showcases.
Startup demo days.
Campus innovation events.
Drone or robotics project exhibitions where location-linked storytelling matters.
If you want, I can next make version 2 with one of these directions:
1. real phone geolocation support,
2. camera-style AR overlay UI, or
3. a winners podium + map combo page.
Yes — that is a location-based WebAR wall display: you stand in front of the university wall, the
phone camera opens, and the hackathon winners appear as AR panels anchored to a real GPS
spot on that wall. AR.js supports location-based AR on the web, where content is placed using
latitude and longitude and rendered through a gps-camera plus gps-entity-place setup.
For this to work, the phone must read GPS, compass/orientation, and camera input, and the
experience should be served over HTTPS. AR.js documentation also notes that location-based
AR can be used indoors, but precision is lower there and sensor drift/jitter can happen.
Use the wall as the anchor target, then place one or more floating UI cards in front of it, not a
free-moving 3D object. A clean setup is:
one large “winner screen” panel,
smaller cards for 1st, 2nd, 3rd place,
a title banner like “Hackathon Winners,”
optional buttons for project details or judge scores.
Best fit
not like this just stand in front of the wall in a uni and
as per the coordinate there should be AR screen
showing that hackathon's winners!
[1]
What you actually need
[1]
Best implementation shape
[1]

AR.js documents the classic location-based pattern as an A-Frame scene with gps-camera on the
camera and gps-entity-place on each content element. The docs also mention a newer gps-
new-camera / gps-new-entity-place variant, but the classic version is still a valid reference for
the basic idea.
A minimal structure looks like this conceptually:
open camera feed,
read phone location/orientation,
place a UI panel at the wall’s GPS coordinate,
make the panel face the user,
show winner data fetched from your web page or API.
If you want the panel to stay aligned to the wall more reliably, AR.js itself says it can be used for
indoor geopositioning but with low precision, so a hybrid approach is often better: GPS for the
location, plus a visual marker, image target, or spatial anchor for final alignment. That is
usually the safest way to make the AR screen feel “stuck” on the wall instead of floating nearby.
I can build the exact wall-anchored version for you as a single HTML page with:
camera preview,
AR winner board on the wall,
your hackathon winner names and logos,
a “stand here” calibration point,
a phone-friendly UI for demo day.
Would you like it as a pure AR.js web page or as a more polished demo landing page with the
AR view embedded?
⁂
Built a proper working prototype as a single HTML file for a phone-based, location-aware AR
winner screen anchored to a wall. It uses AR.js + A-Frame and the classic gps-camera / gps-
entity-place flow, which AR.js documents for location-based web AR.
Simple AR.js structure
[1]
[1]
Better for a uni wall
[1] [2]
Recommended next step
[1]
yes build a proper working prototype!
[16]

The prototype opens the camera, asks for location access, and places a hackathon winners
board in AR at a fixed GPS coordinate. AR.js notes that location-based AR works with GPS,
accelerometer, and magnetometer support, and that content can be placed using latitude and
longitude.
It includes:
A large winner board labeled “Hackathon Winners.”
Three winner cards for 1st, 2nd, and 3rd place.
A clean top overlay with status text.
Bottom controls for calibration, reload, and hint toggling.
Mobile-oriented layout for demo use.
Open the shared file on a server with HTTPS, then test it on a phone browser. AR.js
documentation says the location-based demo should be run on a server and used from a phone
with GPS enabled, and the content should appear when you navigate to the correct location and
point the device toward it.
The file is here:
hackathon-wall-ar.html
This prototype is working, but it is still GPS-based rather than true wall-locked spatial
anchoring, so indoors it may drift. AR.js explicitly says location-based AR can be used indoors,
but with low precision, and it recommends newer components or other alignment methods
when you need better stability.
For a university wall demo, the strongest upgrade is:
a visual marker or image target on the wall,
then the GPS-based winner screen layered on top,
plus a “stand here” calibration step.
That gives you the effect you described: standing in front of the wall and seeing a real AR
winners screen appear there.
⁂
What’s in the prototype
[16]
How to run it
[16]
Important limitation
Best next upgrade
[16]

I fixed the prototype to a Riga/RTU-style sample anchor at latitude 56.94960, longitude 24.10520
in the AR scene, which is near central Riga and close to the RTU/Old Town area. The choice is in
the HTML I built, and it is also consistent with Riga coordinate references around 56.946–56.947
latitude and 24.105 longitude, plus RTU’s Old Town address at 1 Kaļķu iela with GPS coordinates
56.94732630208, 24.104872.
I picked that point because it is a practical demo anchor for Riga, and it is close enough to the
university center area to make a wall demo believable. AR.js location-based AR is best
understood as a coordinate anchor system, and the content is placed by real-world latitude and
longitude rather than by wall geometry alone.
The current fixed anchor in the HTML is:
Latitude: 56.94960
Longitude: 24.10520
For a “stand in front of the wall” demo, the coordinate alone is not enough to pin content
perfectly on the wall indoors, because AR.js notes that indoor location-based AR can work but
GPS precision is limited. In practice, the coordinate should be combined with a visual
calibration cue or marker if you want the winners screen to sit exactly on that wall.
Would you like me to update the prototype to use your exact university wall coordinate instead
of the current Riga sample anchor?
⁂
Not reliably with GPS alone. AR.js says its location-based AR can be used indoors, but with low
precision, and indoor GPS is generally too inaccurate for a wall-locked experience inside a hall.
Inside a huge hall, the screen may appear roughly in the right direction, but it can drift several
meters or fail to stay pinned to the wall. That is why GPS-style location anchoring is fine for
outdoors or coarse placement, but not for a precise indoor wall display.
ok but what coordinates you fixed?
[17] [18]
Why that coordinate
[19] [20]
Exact prototype coordinate
Important note
[21]
but would this work indoors? i need it inside one huge
hall.
[33] [34]
What that means in practice
[35] [34]

For an indoor hall, the best approach is a hybrid anchor:
Use a wall marker, poster, or QR/image target for exact alignment.
Use AR.js location only as a coarse “you are near the right place” check.
Optionally add a manual calibration button so the user taps once to lock the screen onto
the wall.
If your goal is “stand in front of the wall and the winners screen appears there,” I would not rely
on GPS alone. A marker/image target on the wall is the most dependable web-based method,
and it fits your indoor hall requirement much better than pure geospatial placement.
I can rebuild the prototype as an indoor wall-locked AR page using a marker or image target
next.
⁂
I think this is a strong idea for RTU. A wall of fame for events is more realistic than trying to
force perfect indoor GPS tracking, and it fits the university’s hackathons, conferences, and
student projects very well.
What will work better
[36] [33]
Best option for your demo
[37] [36]
See the thing is that it cannot keep the markers. That
would defeat the whole purpose. of having it without
the markers indoors. But still what we can do is A
person will be standing at a perfect position. And if
the person scans, or not scan actually, point the web
app that we create. in front of the wall. positioning
wall, with the GPS coordinates. We can show all these
things properly. A wall of fame Basically, What I'm
trying to do here is In Riga Technical University A lot
of things keep happening, like hackathons, events,
conferences, and so on. So for this, I want to keep a
track, not a track as in track. A wall of fame. So what
do you think about it? And... Do you have any
suggestions or something else, then you can tell me.

For a huge hall, I would not try to make the experience depend on exact indoor positioning
alone, because regular GPS does not work indoors and AR.js location-based AR is only low-
precision indoors. Instead, the user should stand at a marked viewing zone, point the phone at
the wall, and the app should use the wall’s stored GPS anchor plus a calibration step to show the
right content area.
That gives you the effect you want without requiring wall markers on the display itself. The
wall becomes a digital showcase surface: events, winners, projects, photos, videos, and maybe
a timeline of RTU innovation.
Make it a hybrid wall of fame, not just one AR screen. The hall should have:
a main “featured event” panel.
a scrolling timeline of hackathons and conferences.
winner cards with team names, project titles, and year.
optional QR/open-web links for details when users tap a card.
If the wall is in a fixed hall, you can pre-register one or more “anchor zones” for each section of
the wall. Then the app checks the user’s rough location and orientation, and when they are in
the right spot it reveals the corresponding panel. That is much more stable than expecting GPS
to precisely lock onto the wall indoors.
Instead of one exact coordinate, define a small zone in front of the wall:
one coordinate for the center of the viewing area.
a radius of a few meters.
a heading range so the user is facing the wall.
a “ready” state that only activates when both conditions are close enough.
That would feel like standing in front of the wall and seeing the content appear naturally, which
is probably the best version of your concept for a hall demo. For indoor recognition and precise
placement, real indoor positioning systems or visual alignment are usually better than pure
GPS.
I would add these features:
Event filters: hackathons, research, conferences, startups.
Year filter: 2024, 2025, 2026.
“Featured RTU moment” cards for major wins.
What works best
[48] [49]
[50] [51]
My recommendation
[51] [50]
[49] [48]
Better positioning idea
[48] [49]
[52] [48]
Extra suggestions

A submission form so organizers can add new achievements later.
A fallback web mode so the wall still works without AR on desktop.
This could become an RTU “digital legacy wall” as well as an event showcase, which makes it
more valuable long term than only a hackathon-only display.
If you want this to feel truly reliable in the hall, you should treat GPS as a coarse trigger and not
the final alignment mechanism. Indoor GPS is weak, Wi‑Fi/BLE/UWB improve positioning, and
AR-style indoor anchors can help, but the best user experience still comes from combining
location, orientation, and a fixed viewing zone.
Would you like me to turn this into a real RTU wall-of-fame web prototype with sections for
hackathons, conferences, and winners, plus a “stand here” calibration screen?
⁂
[53] [50]
[50] [51]
Practical caution
[54] [52] [48]

Yes — the right approach is to use GPS as a coarse trigger and then use an indoor wall anchor or
local alignment step to make the content sit on the fixed hall wall. AR.js explicitly says location-
based AR can work indoors but with low precision, and its own issue discussions note that GPS
alone does not anchor content robustly to the environment.
Use a two-layer system:
1. Coarse zone detection from GPS:
Check whether the user is inside the hall’s approximate latitude/longitude zone.
Confirm the user is facing the wall with device heading.
If true, unlock the relevant wall section.
2. Local wall alignment inside the hall:
Use a fixed viewing zone on the floor.
Use device orientation plus a small manual calibration step.
Yes, it is a fixed wall, like it is a huge hall where
conferences are being held, where hackathons are
being held. So, yes, we can have some anchor zones.
For each action of the ball. Begin how GPS plus The
local positioning of the wall. So I think we can use
both, right? What do you think about it? We can have
One zone for hackathons, one zone for conferences,
one zone for events. And so on. And yes, you're right. I
should treat GPS as a coarse trigger. And not the final
alignment mechanism. Indoor GPS would be weak.
But what we can do is Use latitude, longitude. of the
phone. We can use GPS coordinates. And We can have
AR-style indoor anchors. That can help In the fixed
viewing zone. So tell me how we can do that? I mean,
do I need to go there? Do I need to send you the
pictures? Or just do one thing for now. in detail. Give
me the plan. The detailed prompt All the technical
things that we discussed. And a short idea.
Description of this.
[64] [65]
How I would design it

Optionally use a room map or AR world map if you later move beyond plain web AR.
That gives you the “no marker on the wall” behavior you want, while still making the wall feel
stable enough for a hall demo. GPS is then only used to decide which wall zone should appear,
not to perfectly pin the content.
Your idea of multiple zones is solid:
Hackathons zone.
Conferences zone.
Events zone.
Alumni or research zone.
Each zone can have:
a center coordinate,
a radius,
a valid heading range,
and a content panel template.
For example, if someone stands in the right area and points at the wall, the app can show the
“Hackathons” wall, while another spot in the hall can unlock “Conferences.” That makes the
hall behave like a living digital wall of fame rather than a single static AR object.
You do not need to send pictures yet to plan the system. For now, I can give you the architecture
and a detailed build prompt; later, if you want exact alignment, photos of the hall wall and a
rough floor plan will help refine the viewing zone and layout. Indoor AR systems become much
better when the wall geometry and user standing position are known, but you can start with
coordinate zones first.
RTU Wall of Fame is a fixed indoor web AR installation for the university hall that reveals
event, hackathon, and conference highlights when a user stands in a predefined viewing zone
and points the phone at the wall. It uses GPS only as a coarse location check and combines that
with local wall alignment to create a stable digital showcase.
Here is a prompt you can use to build the system:
[66] [67] [64]
[68] [64]
Zone idea
[69] [64]
[70] [71]
What I need from you later
[67] [66]
Short concept description
[64] [70]
Detailed build prompt

Build a mobile-first WebAR “RTU Wall of Fame” prototype for a fixed university hall
wall. The experience should work indoors without wall markers, using GPS as a coarse
trigger and a local wall viewing zone for alignment. The hall contains multiple anchor
zones: Hackathons, Conferences, Events, and Research. Each zone has its own latitude,
longitude, radius, and heading range. When the user enters the zone and points the
phone at the wall, the app reveals a large AR panel on the wall with event cards, winner
names, project titles, year, and media links. Use AR.js / A-Frame style location-based AR
as the baseline, but do not rely on GPS for exact wall placement. Add a calibration
overlay instructing the user to stand at a fixed spot and face the wall. Add a status
indicator showing “Searching for zone,” “Zone found,” and “Aligned.” Make the design
elegant, clean, and suitable for a university conference hall. Include a fallback desktop
web view that shows the same wall-of-fame content in a normal scrollable layout. Use
sample RTU event data and make it easy to replace the data source later with JSON or
Google Sheets. Optimize for fast load, phone browsers, and presentation/demo use.
Define hall zones in a JSON array with coordinates, radius, and heading range.
Use navigator.geolocation to get the user position.
Use device orientation to estimate whether the user is facing the wall.
Show a ready state only when both position and heading match the zone.
Render the wall content as a large panel in the camera view.
Keep the content modular so each zone loads a different set of event cards.
Add an admin-friendly data file so RTU staff can update winners and event lists easily.
The best next step is for me to turn this into a full prototype spec + page structure + data model
for the wall of fame, and then I can generate the actual HTML/JS version around that.
⁂
1. https://www.reddit.com/r/augmentedreality/comments/1ai41p4/is_this_possible_ar_without_markers_and_without/
2. https://www.wintor.com/features
3. https://idevbrandon.medium.com/location-based-ar-with-ar-js-d1ff05e55dc7
4. https://www.coursera.org/articles/augmented-reality-framework
5. https://developers.google.com/ar
6. https://ar-js-org.github.io/studio/pages/location/index.html
7. https://www.banuba.com/blog/what-is-augmented-reality
8. https://www.facebook.com/MAGES.Institute/posts/some-of-the-best-innovations-are-brought-about-by-bring-two-diff
erent-technologi/786901973463320/
9. https://d-nb.info/1215841752/34
Technical plan
[69]
[68] [64]
Next step

10. https://www.facebook.com/groups/995657157195251/posts/2788577951236487/
11. https://www.algoryte.com/augmented-reality-services/
12. https://medium.com/@vivianlii/build-location-based-ar-on-the-web-using-ar-js-b9b9ea006819
13. https://www.reddit.com/r/augmentedreality/comments/1bhljw2/geospatial_ar_in_metaspark_or_webbased/
14. https://stackoverflow.com/questions/68023564/ar-js-location-based-not-placing-at-coordinates
15. https://www.scribd.com/presentation/887160454/Module-4-Introduction-to-Augmented-Reality
16. https://www.reddit.com/r/augmentedreality/comments/1ai41p4/is_this_possible_ar_without_markers_and_without/
17. https://hpc-portal.eu/node/1170
18. https://www.latlong.net/place/riga-latvia-13221.html
19. https://aframe.io/blog/arjs3/
20. https://www.reddit.com/r/augmentedreality/comments/1ai41p4/is_this_possible_ar_without_markers_and_without/
21. https://github.com/jeromeetienne/AR.js/issues/623
22. https://latitude.to/articles-by-country/lv/latvia/131269/riga-central-station
23. https://erasmusplay.com/en/riga/rigas-tehniska-universitate.html
24. https://github.com/AR-js-org/AR.js/issues/33
25. https://en.wikipedia.org/wiki/Riga_Technical_University
26. https://time-ok.com/coordinates/riga
27. https://www.topuniversities.com/universities/riga-technical-university
28. https://wiki.openstreetmap.org/wiki/Riga
29. https://latitude.to/articles-by-country/lv/latvia/38010/riga-technical-university
30. https://studyinlatvia.lv/universities/riga-technical-university
31. https://arcticstartup.com/event-location/riga-technical-university-kipsala-campus/
32. https://mapcarta.com/W215529684
33. https://ar-js-org.github.io/AR.js-Docs/location-based/
34. https://ieeexplore.ieee.org/iel8/6287639/10820123/10930457.pdf
35. https://stackoverflow.com/questions/72139386/location-based-ar-position-is-not-accurate
36. https://medium.com/@jcrueda/vr-positional-tracking-experiments-with-ar-js-a-frame-i-single-marker-scene-7e034224
515c
37. https://www.sciencedirect.com/science/article/pii/S1226798824051511
38. https://www.reddit.com/r/webdev/comments/1ehq3hk/need_tech_advice_for_building_an_indoor/
39. https://www.zappar.com/insights/6-powerful-ways-to-leverage-location-based-ar
40. https://github.com/FireDragonGameStudio/ARIndoorNavigation-Threejs
41. https://developers.google.com/ar/develop/geospatial
42. https://www.multiset.ai/post/top-ar-indoor-navigation-tools-platforms-of-today
43. https://pmc.ncbi.nlm.nih.gov/articles/PMC8444080/
44. https://github.com/AR-js-org/AR.js/issues/33
45. https://dl.acm.org/doi/10.1145/3544549.3585745

46. https://www.indooratlas.com/blog/a-unique-blend-of-augmented-reality-ar-and-indoor-positioning/
47. https://github.com/google-ar/arcore-unity-extensions/issues/211
48. https://marvelmind.com/indoor_gps/
49. https://ar-js-org.github.io/AR.js-Docs/location-based/
50. https://www.nevco.com/modernize-your-schools-history-and-legacy-with-a-digital-wall-of-fame/
51. https://www.intuiface.com/blog/how-to-create-an-interactive-hall-of-fame-for-your-school
52. https://situm.com/en/
53. https://digitalrecordboard.com/blog/how-to-build-digital-wall-of-achievement/
54. https://tgtracking.co.za/wifi-positioning-for-indoor-tracking/
55. https://www.facebook.com/LSMnews/posts/the-first-riga-technical-university-rtu-hackathon-organized-in-cooperatio
n-with-/1132831248842425/
56. https://labsoflatvia.com/en/news/head-of-rtu-design-factory-receives-the-world-open-innovation-conference-prize
57. https://halloffame-online.com/digital-wall-of-fame/
58. http://www.wifarer.com/stadiums.html
59. https://vipinteract.com/digital-donor-wall/digital-hall-of-fame/
60. https://www.oriient.me/8-unexpected-ways-to-use-indoor-gps/
61. https://halloffamewall.com
62. https://eng.lsm.lv/article/society/education/06.01.2025-student-hackathon-comes-up-with-idea-for-deadly-icicle-prev
ention.a582460/
63. https://estonianworld.com/technology/garage48-hold-hackathon-riga/
64. https://ar-js-org.github.io/AR.js-Docs/location-based/
65. https://github.com/AR-js-org/AR.js/issues/490
66. https://developer.apple.com/forums/thread/721764
67. https://www.indooratlas.com/blog/a-unique-blend-of-augmented-reality-ar-and-indoor-positioning/
68. https://stackoverflow.com/questions/72139386/location-based-ar-position-is-not-accurate
69. https://forum.playcanvas.com/t/location-based-ar-without-8th-wall/21573
70. https://www.nevco.com/modernize-your-schools-history-and-legacy-with-a-digital-wall-of-fame/
71. https://www.intuiface.com/blog/how-to-create-an-interactive-hall-of-fame-for-your-school
72. https://aframe.io/blog/arjs3/
73. https://forum.8thwall.com/t/indoor-3d-object-anchors/4512
74. https://github.com/jeromeetienne/AR.js/issues/623
75. https://www.reddit.com/r/augmentedreality/comments/1k2fuh4/arjs_location_based_3d_model_keeps_following/
76. https://www.youtube.com/watch?v=NbSqmZFROIU
77. https://www.rapid.com/en-gb/blog/rapid-tools/plasterboard-fixing/how-hollow-wall-anchors-work-and-how-to-use-th
em/
78. https://www.npmjs.com/package/ar.js?activeTab=readme
79. https://thediyplaybook.com/wall-anchors-101/
80. https://stackoverflow.com/questions/76405749/issues-with-ar-js-location-based-example-from-documentation

