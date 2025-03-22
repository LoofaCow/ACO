
---
<p align="center">
  <img src="src/assets/ACO.png" alt="ACO Logo" width="200" />
</p>

# ACO – Artificial Companion Olive

<p align="center">
  <i>Your friendly digital sidekick, blending chat, device control, and personalization into one desktop app. Think of Olive as your ever-present friend, always ready to lend a firm accountability comment (or a nice push) whenever you need it.</i>
</p>

---

## Table of Contents

- [Overview](#overview)
- [What Is ACO?](#what-is-aco)
- [Features](#features)
- [Architecture](#architecture)
- [Unit Structure](#unit-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

ACO – Artificial Companion Olive is a modular, Electron-based desktop application designed to be an AI-powered companion. Whether it’s chatting with you, controlling your smart devices, or letting you tweak settings until it’s just right, Olive’s will be a central hub kinda like Alexa or Siri but run by an ai that gives you a Jarvis/Baymax feeling, and its all wrapped up in a coral-accented interface.

---

## What Is ACO?

At its heart, ACO is meant to be a friendly companion in daily rountines or organization. Imagine a digital assistant like jarvis, powerful enough to control devices and learn your style along the way, and be all helpful like "Olive, am i on track with spending." "Olive:Nope you spend way to much on popcorn again but hey as long as your happy." the dynamic personality is what will be customizable and such like if you didnt want a snarky jarvis you could have a "Nicer" olive by making them more pragmatic but reserved or something whatever floats your boat, i like snarky olive. Also even if you’re not super tech-savvy, Olive is going to be built as a simple to use assistant in your daily life just a companion ai who knows you and will be able to organize your life. It'll be there to help, adapt, and overall organize your life how you didn't know you needed.

---

## Features

- **Modular Dashboard:**  
  A dynamic tile-based interface where each module (chat, device control, automations, alerts, current state) stands on its own. It’s like having a bunch of mini-apps you can mix and match—kinda like widgets on your phone.
  
- **Interactive AI Chat:**  
  Chat with Olive in natural language, tweak its personality, and adjust parameters for a more tailored conversation experience (even if it’s a bit wonky right now, there’s plenty of room for future upgrades).
  
- **Smart Device Management:**  
  Control and monitor your connected devices through an intuitive interface. With category filters and real-time previews, managing your smart home becomes a breeze.
  
- **Advanced Customization:**  
  Dive into settings for API connections, advanced formatting, and even personalize Olive’s system prompt to match your vibe.
  
- **Coral-Themed Aesthetic:**  
  its themed a dark mode with  #ff7559  coral (or “bitterseet” if you’re into specifics) accent, i tried to design it to give it a modern look and i liked the look of coral as well as the name idk if its actually the bittersweet hex close enough.

---

## Architecture

ACO is built on a modular architecture that keeps things neat and easy to manage:
- **Main Process:**  
  Manages the Electron lifecycle, window management, and IPC (inter-process communication).
- **Renderer Process:**  
  Handles the UI and user interactions, with each dashboard tile as its own module.
- **API Integration:**  
  Seamlessly connects with OpenAI-compatible APIs. API connections are stored as local JSON files, allowing you to dynamically switch models.
- **Customization Modules:**  
  Tweak API settings, advanced parameters, and personalize Olive to suit your unique needs.

---

## Unit Structure

For building the Olive Companion Unit (the physical hardware), here’s a breakdown of the parts and components. This is meant to be a high-end, overkill setup that can be further refine as it is prototype. Later, I might update this with actual documentation with even more details.

```
/Project_Olive_Unit/
│
├── /Main_Board/
│   ├── Raspberry Pi 5 Model B (8GB variant recommended for extra headroom)
│   ├── M.2 SSD (e.g., Samsung 970 EVO Plus 500GB or similar high-speed NVMe)
│   ├── M.2 SSD Adapter/Enclosure (for connecting the SSD via USB 3.0 or PCIe)
│
├── /Display/
│   ├── Official Raspberry Pi 7" Touchscreen Display
│   ├── DSI Cable (usually comes with the display)
│   ├── VESA Mount Adapter or Custom 3D Printed Bracket (for VESA-arm mounting)
│
├── /Audio/
│   ├── High-Quality 2W/3W Speaker (compact, full-range for clear audio)
│   ├── Audio Amplifier Board (like a PAM8403 or Adafruit MAX98357A I2S amp)
│   ├── Audio Cables/Connectors (3.5mm jack cable or soldered connections as needed)
│
├── /Camera/
│   ├── Raspberry Pi Camera Module v2 or HQ Camera (depending on your resolution needs)
│   ├── CSI Cable (if not included, for connecting the camera)
│
├── /Cooling/
│   ├── Passive Heat Sinks (aluminum or copper for the Pi 5’s CPU/GPU)
│   ├── Active Cooling: 5V Low-Noise Fan (with PWM control if possible)
│   ├── Fan Bracket/Mounting Kit (or design your own for the 3D case)
│   ├── Thermal Paste (for optimal heat sink contact)
│
├── /Connectivity/
│   ├── Wi-Fi Antenna (external antenna kit if enhanced connectivity is needed)
│   ├── USB Wi-Fi Adapter (if you need extra wireless oomph)
│   ├── (Optional) Bluetooth Module (if not integrated on the Pi 5)
│
├── /Power/
│   ├── Official Raspberry Pi 5 Power Supply (5V, 3A–4A; consider a battery backup option)
│   ├── USB-C Power Cable (high-quality and short to reduce voltage drop)
│   ├── (Optional) Power Management Board (for safe shutdown and battery integration)
│   ├── (Optional) LiPo Battery Pack (for a portable/UPS-style setup)
│
├── /Enclosure_And_Mounting/
│   ├── Custom 3D Printed Case (designed with ventilation holes and internal mounting points)
│   ├── VESA Mount Adapter (or 3D printed bracket for a VESA arm)
│   ├── Screws, Standoffs, Washers (M3 or appropriate sizes to secure everything)
│   ├── Cable Management Accessories (zip ties, Velcro straps, and cable clips)
│
└── /Miscellaneous/
    ├── MicroSD Card (32GB or more, high-end for the OS if not booting from the SSD)
    ├── Ethernet Cable (if a wired connection is preferred)
    ├── HDMI Cable (for debugging with an external display)
    ├── USB Hub (if you need extra USB ports)
    ├── Additional Sensors/Modules (optional: temperature sensor, ambient light sensor, etc.)
```

---

## Installation

### Prerequisites
                
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ACO-Artificial-Companion-Olive.git
   cd ACO-Artificial-Companion-Olive
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

4. (Optional) **Build** the application for distribution:

   ```bash
   npm run build
   ```

---

## Usage

- **Dashboard:**  
  Launch Olive to view the modular dashboard. Each tile shows a preview and opens a detailed view when clicked.
  
- **Chat Module:**  
  Talk with Olive using natural language. Customize API settings and tailor the conversation flow via the settings panel.
  
- **Device Control:**  
  Effortlessly manage your smart devices with category filters and real-time status previews.
  
- **Settings Panel:**  
  Modify API connections, advanced parameters, and even tweak Olive’s system prompt to make it truly yours.

---

## Development Roadmap

- **Phase 1:**  
  Complete the core dashboard and modular tile system.

- **Phase 2:**  
  Roll out a fully-featured chat module with dynamic API switching and deep personalization options.

- **Phase 3:**  
  Expand device management, add robust automation features, and polish the UI.

- **Future Enhancements:**  
  Multi-user support, advanced logging, third-party integrations, and more personalization options.

---

## Contributing

Contributions are always welcome! If you’d like to help improve ACO:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with clear messages.
4. Push to your fork and open a pull request.

For major changes, please open an issue first to discuss your ideas.

---

## License

ACO – Artificial Companion Olive is licensed under the [MIT License](LICENSE). See the LICENSE file for details.

---

## Contact

For questions, suggestions, or collaboration, open an issue on GitHub or drop me an email at [tj98129@gmail.com](mailto:your.email@example.com).
But dont expect a quick response ive had this email since i was 12.

---