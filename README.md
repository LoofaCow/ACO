<p align="center">
  <img src="src/assets/ACO.png" alt="ACO Logo" width="200" />
</p>

# ACO – Artificial Companion Olive

<p align="center">
  <a href="https://electronjs.org/">
    <img src="https://img.shields.io/badge/Electron-28.x.x-9cf.svg?logo=electron&logoColor=white" alt="Electron Version" />
  </a>
  <a href="https://openai.com/">
    <img src="https://img.shields.io/badge/OpenAI-API-blue.svg?logo=openai&logoColor=white" alt="OpenAI API" />
  </a>
  <a href="https://github.com/yourusername/ACO-Artificial-Companion-Olive">
    <img src="https://img.shields.io/badge/Platform-Windows%20|%20Mac%20|%20Linux-informational.svg?logo=github" alt="Platform" />
  </a>
  <img src="https://img.shields.io/github/license/yourusername/ACO-Artificial-Companion-Olive" alt="License" />
</p>

<p align="center">
  <i>An intelligent, customizable AI companion that combines interactive chat, smart device control, and deep personalization in one elegant desktop application.</i>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

ACO – Artificial Companion Olive is a modular Electron-based desktop application designed to serve as your AI-powered companion. With Olive, you can engage in natural, context-aware conversations, manage connected devices, and fine-tune your experience through an advanced settings panel—all wrapped up in a sleek, coral-accented interface.

This project is still under active development, with many features and enhancements planned. Our goal is to create a truly customizable companion that adapts to your needs and evolves over time.

---

## Features

- **Modular Dashboard:**  
  A dynamic tile-based interface where each module (chat, device control, automations, alerts, current state) is self-contained and extensible.
  
- **Interactive AI Chat:**  
  Engage in intelligent conversation with Olive using OpenAI’s API. Enjoy advanced features like dynamic conversation history, personalized system prompts, and adjustable parameters.
  
- **Smart Device Management:**  
  Control and monitor your connected devices through an intuitive interface featuring category filters, real-time status, and interactive configuration views.
  
- **Advanced Customization:**  
  Access a detailed settings panel that lets you configure API connections, adjust advanced formatting parameters, and personalize Olive’s personality and behavior.
  
- **Coral-Themed Aesthetic:**  
  A modern, cohesive design that blends a coral accent with a dark, stylish UI for an engaging user experience.

---

## Architecture

ACO is built with a robust, modular architecture that separates concerns across different layers:

- **Main Process:**  
  Handles the Electron lifecycle, window management, and inter-process communication.
  
- **Renderer Process:**  
  Manages the UI and user interactions, with each dashboard tile implemented as an independent module.
  
- **API Integration:**  
  Provides seamless integration with OpenAI’s API. API connections are stored as local JSON files, allowing dynamic selection and model fetching.
  
- **Customization Modules:**  
  Dedicated settings for API connections, advanced parameters, and personalization options enable deep user control over Olive’s behavior.

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
  Launch Olive to view the modular dashboard. Each tile provides a preview of its module (chat, devices, etc.) and opens a detailed view when clicked.

- **Chat Module:**  
  Interact with Olive via natural language. Customize API settings and personalize the conversation flow through an integrated, tabbed settings panel.

- **Device Control:**  
  Filter and manage your smart devices effortlessly. Use the sidebar to select categories and access detailed configuration views.

- **Settings Panel:**  
  Modify API connections, advanced parameters, and even Olive’s system prompt to tailor the experience to your liking.

---

## Development Roadmap

- **Phase 1:**  
  Complete the core dashboard and modular tile system.

- **Phase 2:**  
  Integrate a fully-featured chat module with dynamic API switching and deep personalization options.

- **Phase 3:**  
  Expand device management, add robust automation features, and refine the user interface.

- **Future Enhancements:**  
  Multi-user support, advanced logging and debugging tools, third-party integrations, and more personalization options.

---

## Contributing

Contributions are warmly welcome! If you’d like to help improve ACO:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear, descriptive messages.
4. Push to your fork and open a pull request.

For major changes, please open an issue first to discuss your ideas.

---

## License

ACO – Artificial Companion Olive is licensed under the [MIT License](LICENSE). Please refer to the LICENSE file for details.

---

## Contact

For questions, suggestions, or collaboration, please open an issue on GitHub or email me at [your.email@example.com](mailto:your.email@example.com).

---

*Crafted with passion and coral vibes by the ACO Team.*

---