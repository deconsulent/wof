from weasyprint import HTML
import os

html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AR Hologram Feature Brief</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
            background-color: #0f172a;
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #f8fafc;
            line-height: 1.6;
            background-color: #0f172a;
        }
        .header {
            border-bottom: 3px solid #38bdf8;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h1 {
            color: #38bdf8;
            font-size: 24pt;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .subtitle {
            color: #94a3b8;
            font-size: 12pt;
            margin-top: 5px;
        }
        h2 {
            color: #7dd3fc;
            font-size: 16pt;
            margin-top: 25px;
            border-left: 4px solid #0ea5e9;
            padding-left: 10px;
        }
        h3 {
            color: #bae6fd;
            font-size: 14pt;
        }
        p {
            font-size: 11pt;
            color: #cbd5e1;
        }
        .pitch-box {
            background-color: #1e293b;
            border: 1px solid #38bdf8;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .pitch-box p {
            font-style: italic;
            margin: 0;
            color: #e2e8f0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #334155;
            font-size: 11pt;
        }
        th {
            background-color: #1e293b;
            color: #38bdf8;
            font-weight: bold;
        }
        td {
            color: #cbd5e1;
        }
        .highlight {
            color: #38bdf8;
            font-weight: bold;
        }
        ul {
            color: #cbd5e1;
            font-size: 11pt;
        }
        li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Feature Brief: AR Hologram Avatar</h1>
        <div class="subtitle">Hackathon Winner Celebration Screen (Volumetric AR Projection)</div>
    </div>

    <p>This document serves as a design and technical specification brief for your development and design teams to implement a "sci-fi style" holographic projection feature in AR.</p>

    <h2>1. The Pitch (For User Stories / Spec Docs)</h2>
    <p>Copy and paste this exact description into your Jira ticket, Trello board, or design brief to instantly align your team:</p>
    <div class="pitch-box">
        <p>"As a user viewing the Hackathon Winners screen, I want to see a life-sized, full-body volumetric hologram avatar of the winning team anchored in my physical room. The avatars should look like translucent 3D holographic projections (similar to Marvel-style telepresence) with subtle blue scanline shaders, light-beam borders, and slight transparency so my physical environment remains visible behind them."</p>
    </div>

    <h2>2. Visual Design Requirements</h2>
    <p>To replicate the reference image, the UI/3D artists need to focus on these core components:</p>
    <ul>
        <li><span class="highlight">Semi-Transparent Base:</span> The avatar must not be fully opaque. An alpha channel blending is required so the real-world camera feed bleeds through the darker parts of the character.</li>
        <li><span class="highlight">Holographic HUD Container:</span> Vertical light-beam grids or faint glowing bounding boxes surrounding the characters to give the illusion they are being beamed into a defined space.</li>
        <li><span class="highlight">Scanlines & Glitch Shaders:</span> Horizontal, moving scanlines that slowly pan across the character to signify a digital broadcast, alongside occasional micro-glitches or chromatic aberration (color splitting).</li>
        <li><span class="highlight">Rim Lighting (Fresnel Effect):</span> The edges of the avatars should glow brightly (typically cyan or pale blue) while the center remains darker and more transparent.</li>
    </ul>

    <h2>3. Technical Implementation Stack</h2>
    <table>
        <thead>
            <tr>
                <th>Layer</th>
                <th>Technology / Method</th>
                <th>Developer Notes</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>AR Tracking</strong></td>
                <td>ARKit (iOS) / ARCore (Android)</td>
                <td>Use Horizontal Plane Detection to anchor the life-sized avatars directly onto the user's floor.</td>
            </tr>
            <tr>
                <td><strong>Visual Effects</strong></td>
                <td>Custom Shaders (Unity/Unreal/SceneKit)</td>
                <td>Apply a custom <em>Hologram Shader Effect</em> to the 3D materials (requires Alpha Blending, Fresnel rim lighting, and a scrolling scanline texture).</td>
            </tr>
            <tr>
                <td><strong>3D Asset Format</strong></td>
                <td>Volumetric Video, .USDZ, or .glTF</td>
                <td>Depends on capture method: use Volumetric Video (e.g., .mp4 with depth) for real people, or rigged .glTF/.usdz for 3D modeled avatars.</td>
            </tr>
            <tr>
                <td><strong>Lighting</strong></td>
                <td>Emissive Materials</td>
                <td>Do not rely entirely on the AR environment lighting; the avatars should be somewhat self-illuminating (emissive) to pop against dark backgrounds.</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
"""

output_path = "/tmp/AR_Hologram_Feature_Brief.pdf"
HTML(string=html_content).write_pdf(output_path)
print(f"File generated at: {output_path}")