# ChatPaste

ChatPaste is a Chrome extension send chat logs from ChatGPT to terminal stdout.
I butchered tomnomnom's webpaste and remake it into ChatPaste with the help of ChatGPT. See ## Credits for more info.
I don't have any plan for local server. Just keep using tomnomnom's webpaste server.

## Installation

To install ChatPaste, follow these steps:
1. Download or clone the extension files from this GitHub repository.
  `git clone https://github.com/pro7357/chatpaste.git`
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable developer mode by clicking the toggle switch in the top right corner.
4. Click the "Load unpacked" button and select the `extension` folder.

Install tomnomnom's webpaste server:
1. `go install github.com/tomnomnom/hacks/webpaste@latest`

## Usage

To use ChatPaste, follow these steps:
1. Open terminal, set environment variable:
- `export WEBPASTE_TOKEN=chats`
2. Run webpaste.
-  `webpaste`
-  or
-  `webpaste | tee -a save_file.txt`
3. Open the chat conversation in ChatGPT.
4. Click on the ChatPaste icon in your Chrome toolbar. All chats will be printout to terminal.

### Live chats
Live printout chat to terminal as soon as the chat posted.

1. Edit the title of chat conversation, add `[token]`
2. Open terminal, set environment variable:
- `export WEBPASTE_TOKEN=token`
3. Run webpaste.
-  `webpaste`
-  or
-  `webpaste | tee -a live_file.txt`
4. Start chatting.


If Chat History & Training disable:
1. Open terminal, set environment variable:
- `export WEBPASTE_TOKEN=chats`
2. Run webpaste.
-  `webpaste`
-  or
-  `webpaste | tee -a live_file.txt`
3. Start chatting.

### Notes
- For button, the token is hardcoded, `chats`. For live log, you can put any token in the bracket.
- The `[token]` is the switch that ChatPaste use to start live log.
- ChatPaste is hardcoded to use port 8080.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
- This project is based on [webpaste](https://github.com/tomnomnom/hacks/tree/master/webpaste) by [tomnomnom](https://github.com/tomnomnom). 
- This project is build with the help from ChatGPT.
