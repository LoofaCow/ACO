<p align="center">
  <img src="ACO-removebg-preview.png" alt="ACO Logo" width="200" />
</p>

<h1 align="center">ACO - Artificial Companion Olive</h1>

<p align="center">
  <a href="https://electronjs.org/">
    <img src="https://img.shields.io/badge/Electron-28.x.x-9cf.svg?logo=electron&logoColor=white" alt="Electron Version" />
  </a>
  <a href="https://openai.com/">
    <img src="https://img.shields.io/badge/OpenAI-API-blue.svg?logo=openai&logoColor=white" alt="OpenAI API" />
  </a>
  <img src="https://img.shields.io/badge/Platform-Windows%20|%20Mac%20|%20Linux-informational.svg?logo=github" alt="Platform" />
  <img src="https://img.shields.io/github/license/your-username/aco" alt="License" />
</p>

<p align="center">
  <i>An Electron-based desktop chat application designed as an “Artificial Companion,” integrating a chat interface with an OpenAI backend, plus flexible settings and logging.</i>
</p>

---

## Table of Contents
1. [Features](#features)
2. [Screenshots](#screenshots)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features
- **Modular Design** – Clear separation between the main process, renderer process, and supporting modules.
- **API Connections** – Easily configure multiple OpenAI endpoints and switch between them.
- **Customizable Prompts** – Adjust system prompts, context templates, advanced parameters (like max tokens, temperature, etc.).
- **Integrated Logging** – View logs in-app or (planned) pop out into a separate window for debugging.
- **Coral-Themed UI** – A stylish, cohesive design featuring bubble-style buttons and drawers.

---

## Screenshots
*(Coming soon! Feel free to insert your own screenshots or GIFs here.)*

---

## Getting Started

1. **Clone** the repository:
   ```bash
   git clone https://github.com/LoofaCow/ACO.git
   ```

2. **Install** dependencies:
   ```bash
   cd aco
   npm install
   ```

3. **Run** the application:
   ```bash
   npm start
   ```

4. (Optional) **Build** the application for distribution:
   ```bash
   npm run build
   ```

---

## Project Structure

```plaintext
ACO/
├── src/
│   ├── data/
│   │   ├── api/          # Local JSON files for API connections
│   │   └── default.json  # Default connection info
│   ├── modules/
│   │   ├── api.js        # Manages OpenAI API calls
│   │   ├── apiStorage.js # Handles saving/loading API connections
│   ├── renderer/
│   │   ├── assets/
│   │   │   └── ACO-removebg-preview.png # ACO logo
│   │   ├── index.html    # Main UI
│   │   ├── logging.html  # Logging popout (under development)
│   │   ├── preload.js    # Preload script exposing secure APIs
│   │   ├── renderer.js   # Renderer entry point
│   │   ├── renderer_core.js
│   │   ├── renderer_chat.js
│   │   ├── renderer_settings.js
│   │   ├── settings_api.js
│   │   ├── settings_logging.js
│   │   ├── settings_formatting.js
│   │   ├── settings_advanced.js
│   │   ├── styles.css
│   │   ├── styles_base.css
│   │   ├── styles_layout.css
│   │   └── styles_components.css
├── main.js              # Electron main process
├── package.json
└── README.md
```

---

## Usage

1. **Chat Interaction**  
   - Type your message in the input field; it appears as a user bubble on the right.  
   - The system or “AI” replies, appearing as a bot bubble on the left.

2. **Settings Panel**  
   - Click the gear icon to access settings for API connections, logging, advanced parameters, etc.

3. **API Connections**  
   - Save multiple OpenAI endpoints and choose a default connection/model.

4. **Logging & Debugging**  
   - View logs in real time within the app.  
   - (Planned) Pop out logging into a separate window.

5. **Advanced Parameters**  
   - Adjust system prompts, context templates, or advanced parameters (temperature, max tokens, etc.) to fine-tune AI behavior.

---

## Contributing
1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Push to your fork and submit a pull request  

We welcome bug reports, feature requests, and general feedback.

---

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use and modify ACO as you wish, but please provide attribution back to this repository.

---

<p align="center">
  <strong>Happy chatting with your Artificial Companion!</strong>
</p>
