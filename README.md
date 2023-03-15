# ChatPaste

ChatPaste is a Chrome extension send chat logs from ChatGPT to terminal stdout.
I butchered tomnomnom's webpaste and remake it into ChatPaste with the help of ChatGPT. See ## Credits for more info.
I don't have any plan for local server. Just keep using tomnomnom webpaste server. You can install it like these:
`go install github.com/tomnomnom/hacks/webpaste@latest`

## Installation

To install ChatPaste, follow these steps:
1. Download or clone the extension files from this GitHub repository.
  `git clone https://github.com/pro7357/chatpaste.git`
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable developer mode by clicking the toggle switch in the top right corner.
4. Click the "Load unpacked" button and select the `extension` folder.

## Usage

To use ChatPaste, follow these steps:
1. Open terminal, set environment variable: export WEBPASTE_TOKEN=chats
2. Run webpaste. ChatPaste is hardcoded to use port 8080.
3. Open the chat conversation in ChatGPT.
4. Click on the ChatPaste icon in your Chrome toolbar. All chats will be printout to terminal.
### Live log
1. Edit the title of chat conversation, add `[token]`
Note1: For button, the token is hardcoded, `chats`. For live log, you can put any token in the bracket.
Note2: The `[token]` is the switch that ChatPaste use to start live log.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
This project is based on [webpaste](https://github.com/tomnomnom/hacks/tree/master/webpaste) by [tomnomnom](https://github.com/tomnomnom). 
This project is impossible to me without the help from ChatGPT.
