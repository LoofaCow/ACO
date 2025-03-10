The ACO project is an Electron-based desktop chat application designed as an “Artificial Companion.” It integrates a chat interface with an API backend (using OpenAI) and includes various settings for API connections, logging, and formatting. The application is structured in a modular way, with clear separation between the main process, renderer process, and supporting modules.

Structure & Key Components
1. Main Process & Application Setup
main.js:
Purpose: Sets up the Electron main window and handles core IPC events.
Highlights:
Creates a BrowserWindow with custom dimensions and window controls.
Loads index.html from the renderer folder.
Includes handlers for window control actions (minimize, maximize, close) and a special handler to toggle a separate logging window.
Note: It has security warnings enabled (with nodeIntegration and contextIsolation set in a particular way), which is common in desktop apps but something to keep an eye on for production use.
2. Preload & Renderer Security
preload.js:
Purpose: Bridges the gap between Node.js and the renderer process securely.
Highlights:
Exposes safe APIs to the renderer through electronAPI and secureAPI for window control, version fetching, logging, and IPC communication.
3. API Management & Storage
api.js:
Purpose: Handles API communication (sending messages, fetching models) using OpenAI’s API.
Highlights:
Constructs prompts by combining a system prompt and a context template with the user’s message.
Uses the Fetch API to communicate with the backend endpoint and extract responses.
apiStorage.js:
Purpose: Manages local storage of API connection details.
Highlights:
Saves individual connection files and a default connection JSON.
Reads stored connection details from the file system.
4. Renderer (User Interface) Components
HTML & CSS:


index.html & logging.html:
Define the layout for the main chat interface and a separate logging window.
Use multiple CSS files (styles.css, styles_base.css, styles_layout.css, styles_components.css) to organize global resets, layout, and UI components (like chat bubbles and settings panels).
renderer.js:


Purpose: Acts as the entry point for the renderer process by initializing the core functionalities.
renderer_core.js:


Purpose: Sets up core event listeners and global functionalities.
Highlights:
Registers events for navigation (hamburger menu, settings, and right drawer toggles).
Implements custom logging by overriding console.log and console.error to also append messages to the UI log container.
Manages window control actions through the exposed Electron APIs.
renderer_chat.js:


Purpose: Manages the chat interface.
Highlights:
Captures user messages, appends them to the chat container, and then uses the API module to fetch a bot response.
Automatically scrolls the chat view to the bottom as new messages are added.
renderer_settings.js & Settings Modules:


Purpose: Provide a settings panel with multiple tabs.
Submodules:
settings_api.js:
Lets users add new API connections and choose a default connection and model.
Provides a model search/filter function and updates the dropdown based on available models.
settings_logging.js:
Manages the logging tab, including features like clearing logs and toggling a pop-out logging window.
settings_formatting.js:
Enables customization of the context template and system prompt that shape the bot’s responses.
Advanced & Extensions Tabs:
Currently placeholders for future functionality (“Coming Soon…” messages).

Functionality in a Nutshell
Chat Interaction:
 The user sends a message via the chat interface (input field). The message is displayed as a user bubble, then processed by renderer_chat.js, which calls the API manager in api.js to get a response. The bot’s response is then appended to the chat container.


API Connection Management:
 Users can add multiple API connections and select one as the default. The selected connection is saved via apiStorage.js and used by the API manager to send requests. The settings UI in settings_api.js facilitates these operations.


Logging & Debugging:
 All logs are captured both in the console and a dedicated log UI component. A pop-out window for logs (managed in main.js and settings_logging.js) can be toggled for better debugging visibility.


Customization & Formatting:
 Users can adjust the “voice” of the conversation by editing the system prompt and context template in the formatting tab. These settings are stored in localStorage and then used to build the full prompt for each API call.
