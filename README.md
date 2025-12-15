# R2K PromptGuard

R2K PromptGuard is a small, client‑side tool that scans prompts for sensitive content before you send them to a Large Language Model (LLM).

It runs in the browser only. There is no backend and no network call from this page.

# What this tool does
Lets you paste or type a prompt and scan it for:
  - Exact match keywords that you define
  - Extra rules loaded from a shared configuration file
- Highlights all matches and lists them in a table
- Keeps all data inside the browser
- Stores your keyword settings locally so they persist across sessions

This makes it useful as a “pre‑check” before you paste logs, code, or text into any LLM.
<img width="711" height="749" alt="Maineva" src="https://github.com/user-attachments/assets/0d7f3397-aee1-4b6f-8f35-53965d529855" />

## Features
- Pure client‑side HTML/JS**  
  Open `index.html` in a browser and use it. No server is required.

- Prompt scanning
  Scan the content in the “Enter prompt” area and see:
  - A findings table (type, value, position)
  - A preview with matched text highlighted

- Exact match keywords (optional) 
  Define words in a single input field, comma separated and case‑insensitive.

- Master configuration support(Mandatory for larger configured prebuild)
  Load a shared JSON config (`master_config.json`)
  This config can be tailored to your organization, project, or personal needs.

- Copy prompt  
  Copy the (reviewed and edited) prompt to your clipboard with one click.

- Privacy by design 
  The page does not send prompts or results to any external service.


# Getting Started
- Open `index.html` in a modern browser.
- click `Import master config` and select a JSON with `{ rules: [{ name, patterns[] }] }`.
- Enter the prompt and click `Scan`.

# Structure
/
├── index.html
├── styles.css
├── app.js
└── master_config.json

# Credit
Developer: Rama Nagireddi rkkn126@gmail.com.
