/* eslint-browser */

(function(context) {
  "use strict";

  function TranscriptPlayer(playerEl) {
    if (playerEl === undefined) {
      throw "No parent elment specified";
    }
  }

  context.TranscriptPlayer = TranscriptPlayer;
}(window));
