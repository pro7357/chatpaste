#!/usr/bin/bash
_help(){ cat <<E0F
Usage: ./chatpaste.sh FILE
Write ChatGPT's html output to html/{FILE}.html and markdown output to {FILE}.md
If no FILE is given, use today's date as the FILE name.

Don't forget to create the html directory yourself.
E0F
}
# Use machine-id to decide the location of savefiles.
if [[ $(</etc/machine-id) == 7357* ]]; then
    BASE="$HOME/document/chatgpt"
else
    BASE="$PWD"
fi 2>/dev/null

export WEBPASTE_TOKEN=iloveweb

_main(){
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

        tee -a "$BASE/html/$1.html" <<< "$line" \
        | html2md -i --opt-escape-mode="disable" \
        | tee -a "$BASE/$1.md"
    done < <(webpaste)
}

_menu(){
    if [[ $1 == '-h' || $1 == --help ]]; then
        _help
    elif [[ -z $1 ]]; then
        _main "$(date +%F)"
    else
        _main "$@"
    fi
}

[[ $0 == "$BASH_SOURCE" ]] && _menu "$@"
