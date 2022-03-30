# meeting-bingo
This is a bingo board app in Javascript and CSS. It's pretty simple and you could argue that every function being public is messy, but it's solid and it works.

Live demo can be found at [avgaalla.nu](https://avgaalla.nu)

# Deployment
Deploy by placing sourcefiles into directory served by a web server. No backend required and all external dependencies are fetched from CDN.

# Deployment (Third party sites)

Load style.css as a stylesheet and app.js as a script.
Make sure that necessary jQuery and jQuery UI files are loaded as well (See [index.html](./index.html) for complete list of the necessary css and js files)

Initiate app with `$(document).ready(function () { app = BingoApp(); })`

Optional parameters are input_points, seed, element.

input_points should be an array containing strings with the content of the board (for default, see [app.js](./app.js))
seed should be a hexadecimal integer (default: generated randomly)
element is a string containing some sort of jQuery-compatible selector, like "#div-id", ".container-class" or "body" (If you're brave). (default: #bingo-container)

Those values are not necessary and defaults will be loaded/generated if not provided.


# Features
Stores board data in local storage so it can be "accidental reloading"-proof. Multiple boards can be stored at once.

Completely rewritten to support integration in third-party sites if desired.

Confetti (If implemented fully)

# Dependencies
jQuery (https://jquery.com/)

jQuery UI (https://jqueryui.com/)

confetti-js (https://www.npmjs.com/package/confetti-js) - Not necessary for running.

Bootstrap 3 (https://getbootstrap.com/) - Not necessary for integration, but this was the easiest way to make it mobile friendly since I hate CSS.

# TODO
On the TODO-list is the following things(in no particular order):

# Bugs
Report bugs and other issues here on github.
