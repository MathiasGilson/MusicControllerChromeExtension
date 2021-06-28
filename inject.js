const PLAYERS = {
    "www.youtube.com": {
        next: {
            code: '"KeyN"',
            key: '"n"',
            keyCode: 78,
            shiftKey: true,
        },
        prev: {
            code: '"KeyP"',
            key: '"p"',
            keyCode: 80,
            shiftKey: true,
        },
        playPause: {
            code: '"KeyK"',
            key: '"k"',
            keyCode: 75,
        },
    },
    "music.youtube.com": {
        next: {
            code: '"KeyJ"',
            key: '"j"',
            keyCode: 74,
        },
        prev: {
            code: '"KeyK"',
            key: '"k"',
            keyCode: 75,
        },
        playPause: {
            code: '"Spacebar"',
            key: '" "',
            keyCode: 32,
        },
    },
    "www.deezer.com": {
        buttonBased: true,
        next: `'.svg-icon-group-btn[aria-label="Next"]'`,
        prev: `'.svg-icon-group-btn[aria-label="Back"]'`,
        playPause: `'.svg-icon-group-btn[aria-label="Pause"], .svg-icon-group-btn[aria-label="Play"]'`,
    },
    "open.spotify.com": {
        buttonBased: true,
        next: '".spoticon-skip-forward-16"',
        prev: '".spoticon-skip-back-16"',
        playPause: '".spoticon-play-16, .spoticon-pause-16"',
    },
    "listen.tidal.com": {
        buttonBased: true,
        next: `'.playback-controls__button--white-icon[data-test="next"]'`,
        prev: `'.playback-controls__button--white-icon[data-test="previous"]'`,
        playPause: `'.playback-controls__button--white-icon[data-test="play"], .playback-controls__button--white-icon[data-test="pause"]'`,
    },
    "musique.qub.ca": {
        buttonBased: true,
        next: `'.MuiButtonBase-root[data-testid="button-SKIP_NEXT"]'`,
        prev: `'.MuiButtonBase-root[data-testid="button-SKIP_PREVIOUS"]'`,
        playPause: `'.MuiButtonBase-root[data-testid="playButton"]'`,
    },
}

let lastPlayingTab = {}

chrome.commands.onCommand.addListener((command) => {
    console.log("key pressed")
    chrome.tabs.query({}, (tabs) => {
        const playerTab = tabs
            .filter((tab) => !tab.mutedInfo || !tab.mutedInfo.muted)
            .map((tab) => {
                console.log(tab)
                return { url: tab.url, hostname: new URL(tab.url).hostname, id: tab.id, audible: tab.audible }
            })
            .reduce((acc, element) => {
                if (lastPlayingTab && lastPlayingTab.id === element.id && lastPlayingTab.url === element.url) {
                    return [element, ...acc]
                }
                return [...acc, element]
            }, [])
            .sort((a, b) => b.audible - a.audible)
            .find((tab) => Object.keys(PLAYERS).includes(tab.hostname))

        console.log("playerTab", playerTab)

        if (!playerTab) return

        lastPlayingTab = playerTab

        const player = PLAYERS[playerTab.hostname]
        let action

        switch (command) {
            case "NextTrack":
                action = player.next
                break

            case "PreviousTrack":
                action = player.prev
                break

            case "PlayPause":
                action = player.playPause
                break

            default:
                return
        }

        console.log(action)

        const injectedCode = player.buttonBased
            ? `document.querySelector(${action}).click()`
            : `var myScript = document.createElement('script');
            myScript.textContent = 'var e = new KeyboardEvent("keydown", {altKey: false, bubbles : true, cancelBubble: false, cancelable : true, code : ${
                action.code
            },composed: true, isTrusted: true, defaultPrevented: true, charCode: 0, shiftKey : ${!!action.shiftKey}, key: ${
                  action.key
              }, keyCode: ${action.keyCode},location: 0, metaKey: false}); console.log(e); document.dispatchEvent(e);';
            
            document.head.appendChild(myScript);`

        chrome.tabs.executeScript(playerTab.id, {
            code: injectedCode,
        })
    })
})
