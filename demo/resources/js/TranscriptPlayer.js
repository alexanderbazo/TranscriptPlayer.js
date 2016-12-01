var App = App || {};
App.TranscriptPlayer = (function() {
  "use strict";
  /* eslint-env browser */
  /* global TranscriptPlayer */

  var that = {};

  function init() {
    var TPlayer = new TranscriptPlayer(document.querySelector(".player")),
      segments = [];

    segments.push({
      id: "s0001",
      text: "Der Hausmannsturm befindet sich in der Neumärker Straße in Helmstedt.",
      start: 26000,
      end: 30000,
    });
    segments.push({
      id: "s0002",
      text: "Er ist das älteste erhaltene Stadttor im Braunschweiger Land.",
      start: 30000,
      end: 34000,
    });
    segments.push({
      id: "s0003",
      text: "Der Hausmannsturm wurde viereckig angelegt und besitzt eine Höhe von 36 Metern.",
      start: 34000,
      end: 41000,
    });
    segments.push({
      id: "s0004",
      text: "Der Tordurchgang ist durch ein Kreuzgewölbe geprägt. Der Hausmannsturm wurde schon 1286 erwähnt, erhielt sein heutiges Aussehen allerdings erst in der ersten Hälfte des 15. Jahrhunderts als letztes Tor des Stadtmauerringes.",
      start: 34000,
      end: 58000,
    });
    segments.push({
      id: "s0005",
      text: "Die Helmstedter Stadtmauer hatte einst acht Türme.",
      start: 58000,
      end: 62000,
    });
    segments.push({
      id: "s0006",
      text: "Heute sind von diesen acht Türmen noch vier in Resten vorhanden.",
      start: 62000,
      end: 67000,
    });

    TPlayer.loadTranscript("resources/audio/hausmannsturm.ogg", segments);

  }

  that.init = init;
  return that;
}());
