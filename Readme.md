# TranscriptPlayer.js
**Work in Progress**

A Javascript Audio Player for synchronous playback of alligned audio and text segment files. TranscriptPlayer.js is build upon vanilla javascript and the HTML5 audio tag. There are no other dependencies.

## Build

To build a minified version of the library into `build` run `npm install && npm run build` in the project directory. Currently the bulid uses some npm dependencies and common shell tools. You should be fine building under Linux or macOS.

## Usage

Link the libray file in your HTML document:

```
<script src="transcript-player.min.js"></script>
```

If you want to use the default player theme link the css file and make sure, that the symbol font `winjs-symbols.woff` (https://github.com/winjs/winjs) is in the same folder.

```
<link rel="stylesheet" href="transcript-player.css">
```

Create a new player instance and specifiy the host element

```
var TPlayer = new TranscriptPlayer(document.querySelector(".player"));
```


Load an audio file and the transcript records:

```
TPlayer.loadTranscript("demo.ogg", segments);
```

For the audio file you can use any format that is supported by the default HTML5 audio tag. You may use URLs or ObjectURLs. `segments` must be an array with objects represeting the transcripted text segments. Each entry must provide atleast the following properties:

* `id`: A unique ID for this segment
* `text`: The transcripted text
* `start`: The starting point of this segment (in ms), relativly alligned to the audio file
* `end`: The ending point of this segment (in ms), relativly alligned to the audio file

### Playback

```
TPlayer.play(); // start playback
TPlayer.pause(); // pause playback
```

### Customization
*Work in Progress*

## Demo
This repository contains a demo implementation of the TranscriptPlayer.js. The demo uses the audio transcript of [this Wikipedia article](Creative Commons Attribution-ShareAlike 3.0) recorded by [Blanki_Ostfalen](https://de.wikipedia.org/wiki/Benutzer:Blanki_Ostfalen). Audio and text are licenced under [Creative Commons Attribution-ShareAlike 3.0](https://creativecommons.org/licenses/by-sa/3.0/). 

To build the latest version of the demo run `npm install && npm run build`

![Screenshot of demo implementation](docs/player-v0.0.1.png)


