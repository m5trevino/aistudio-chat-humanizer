# ⚡ REFINERY v12.4
**The Executioner / Log Calibration System**

## 💀 THE MISSION
A dedicated workbench for "cleaning" raw AI interactions and forging high-precision prompts ("Golden Prompts"). It ingests raw JSON logs, strips out noise, and allows the Architect to manually refine the context before firing a "Kinetic Strike" back at the model.

## 🏗️ ARCHITECTURE
*   **Framework:** Python (PyQt6) Desktop Application.
*   **Database:** SQLite (`refinery_vault.db`) for session management.
*   **Integration:** Connects to `peacock-engine` for inference.

## 🚀 PROTOCOLS
### 1. Launch Application
`python3 refinery.py`

## 🛠️ FEATURES
*   **Ingest:** Drag-and-drop JSON chat logs.
*   **Sanitize:** Auto-strips markdown, code blocks, or conversational fluff.
*   **Persona Calibration:** Dedicated editor for System Instructions.
*   **Kinetic Strike:** One-button re-execution of the refined prompt.
