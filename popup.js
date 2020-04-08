document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#support").addEventListener("click", function () {
        window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JEAWYHFCZ8LT4&source=url")
    })

    document.querySelector("#rate").addEventListener("click", function () {
        window.open("https://chrome.google.com/webstore/detail/pohakmokiogdbhiocmacgalcmnfdbbne")
    })

    document.querySelector("#about").addEventListener("click", function () {
        window.open("https://github.com/MathiasGilson/MusicControllerChromeExtension")
    })

    document.querySelector("#feedback").addEventListener("click", function () {
        window.open("https://github.com/MathiasGilson/MusicControllerChromeExtension/issues")
    })
})
