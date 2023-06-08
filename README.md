# ChatPaste

ChatPaste is a Chrome extension that send chat logs from ChatGPT to terminal stdout.

## Limitation

Only tested with free ChatGPT, not on ChatGPT Plus or Playground.

Only tested on desktop Chromium on linux.

Formating from response is mess-up, paragraph merged into wall of text. That the limitation from using `textContent`. I considered injecting breakpoint, but for now, use `Enable raw HTML` and other tool to get better output. See `## Usage` below.

`Send all chats` button only send chats that are visible. Branch that are not selected/hidden will not be included.

`Shared Links` is not tested, yet.

## Installation

To install ChatPaste, follow these steps:
1. Download or clone the extension files from this GitHub repository.
  `git clone https://github.com/pro7357/chatpaste.git`
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable developer mode by clicking the toggle switch in the top right corner.
4. Click the "Load unpacked" button on the top left.
5. Go to downloaded/cloned folder, `chatpaste/extension`.
6. Select the `extension` folder and click open.
7. Extension is loaded now, you might have to pin it in toolbar icon.

Install tomnomnom's webpaste server:
1. `go install github.com/tomnomnom/hacks/webpaste@latest`

## Usage

To use ChatPaste, follow these steps:
1. Open terminal, set environment variable:
- `export WEBPASTE_TOKEN=iloveweb`
2. Run webpaste.
-  `webpaste`
-  or
-  `webpaste | tee -a save_file.txt`
3. Open the chat conversation in ChatGPT.
4. By default, live is enabled to send chats to terminal stdout, as soon as it posted or responded.
5. Click on toolbar icon to change the settings or `Send all chats` to terminal.

### webpaste (by tomnomnom)
By default, webpaste listen on `0.0.0.0` and port `8080`. You can change this using flag `-a` and `-p`.
For example:
- `webpaste -a 127.0.0.1 -p 8080`
For more details, visit `https://github.com/tomnomnom/hacks/tree/master/webpaste`

### Enable raw HTML
By default, ChatPaste send `textContent` which will mess the paragraph, formating etc.

To get better formating, `Enable raw HTML` and use other tools such pandoc or html2md.

### html2md
Install: `go install github.com/suntong/html2md@latest`

Somehow, direct `webpaste | html2md` doesn't work.

Workaround:
``` bash
export WEBPASTE_TOKEN=iloveweb
while true; do
    read -r line
    html2md -i --opt-escape-mode="disable" <<< "$line" | tee -a save_file.txt
done < <(webpaste)
```

This is the example to "clean" the html and get output similar to disabling raw HTML.
``` bash
export WEBPASTE_TOKEN=iloveweb
while true; do
    read -r line
    prompt=$(rg '^(.*)?<div class="w-\[30px\]"><div.*?alt="User".*?</div></div>(<div class="text-xs.*?>)(<button.*)$' -o -r '$1$2<text>Prompt: </text>$3' <<< "$line")
    if [[ -n "$prompt" ]]; then
        line=$prompt
    fi

    chatgpt=$(rg '^(.*)?<div class="w-\[30px\]"><div.*?y="-9999">ChatGPT.*?</div></div>(<div class="text-xs.*?>)(<button.*)$' -o -r '$1$2<text>ChatGPT: </text>$3' <<< "$line")
    if [[ -n "$chatgpt" ]]; then
        line=$chatgpt
    fi

    html2md -i --opt-escape-mode="disable" <<< "$line" | tee -a save_file.txt
done < <(webpaste)
```
Yes, I use regex to parse html. Use at your own risk. Don't use it for summoning ritual or demonic contract.

### chatpaste.sh
A bash script to wrap webpaste and html2md. I use it to save both HTML and markdown files.

## License

I know nothing about license. The black and white sheep use MIT, so MIT it is.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
- For more details on html2md, visit `https://github.com/suntong/html2md`
- This project originally based on [webpaste](https://github.com/tomnomnom/hacks/tree/master/webpaste) by [tomnomnom](https://github.com/tomnomnom). 
- This project is build with the help from ChatGPT.
