/* eslint-browser */

(function(context) {
  "use strict";

  var DEFAULT_SEGMENT_TEMPLATE =
    "<span class='transcript-player-segment'><span class='handle'></span><span class='time'><span class='start'>{{start}}ms</span><br />-<br /> <span class='end'>{{end}}ms</span></span><span class='text'>{{text}}</span></span>";

  function createPlayer(instance, playerEl) {
    var docfrag = document.createDocumentFragment(),
      viewer = document.createElement("div"),
      player = document.createElement("audio"),
      controls = document.createElement("div"),
      playbackbutton = document.createElement("span"),
      mutebutton = document.createElement("span"),
      seekbar = document.createElement("input");
    viewer.classList.add("transcript-player-viewer");
    controls.classList.add("transcript-player-controls");
    player.classList.add("transcript-player-player");
    playbackbutton.classList.add("transcript-player-control", "button",
      "play-button", "paused");
    mutebutton.classList.add("transcript-player-control", "button",
      "sound-button", "unmuted");
    seekbar.classList.add("transcript-player-control", "seekbar");
    seekbar.setAttribute("type", "range");
    seekbar.setAttribute("min", "0");
    seekbar.setAttribute("max", "100");
    seekbar.value = 0;
    playbackbutton.addEventListener("click", instance.onPlayButtonClicked.bind(
      instance));
    mutebutton.addEventListener("click", instance.onSoundButtonClicked.bind(
      instance));
    seekbar.addEventListener("input", instance.onSeekbarChanged.bind(instance));
    controls.appendChild(playbackbutton);
    controls.appendChild(mutebutton);
    controls.appendChild(seekbar);
    docfrag.appendChild(viewer);
    docfrag.appendChild(controls);
    docfrag.appendChild(player);
    playerEl.appendChild(docfrag);
    playerEl.viewer = playerEl.querySelector(".transcript-player-viewer");
    playerEl.player = playerEl.querySelector(".transcript-player-player");
    playerEl.seekbar = playerEl.querySelector(
      ".transcript-player-control.seekbar");
    playerEl.classList.add("transcript-player-host");
    return playerEl;
  }

  function TranscriptPlayer(playerEl) {
    if (playerEl === undefined) {
      throw "No parent element specified";
    }
    this.playerElement = createPlayer(this, playerEl);
    this.audioPlayer = this.playerElement.player;
    this.segmentTemplate = DEFAULT_SEGMENT_TEMPLATE;
    this.listeners = [];
    this.tick = 250;
  }

  TranscriptPlayer.prototype.notifyAll = function(event, data) {
    var i,
      eventData = data || null;
    if (this.listeners[event]) {
      for (i = 0; i < this.listeners[event].length; i++) {
        this.listeners[event][i](eventData);
      }
    }
  };

  TranscriptPlayer.prototype.addEventListener = function(event, listener) {
    if (event === undefined || listener === undefined) {
      throw "Must specified event and listener";
    }
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(listener);
  };

  TranscriptPlayer.prototype.onPlaybackTick = function() {
    this.updateSeekbar(this.audioPlayer.currentTime * 1000);
    this.selectCurrentSegment(this.audioPlayer.currentTime * 1000);
  };

  TranscriptPlayer.prototype.startPlaybackTick = function() {
    if (this.playbackTick) {
      return;
    }
    this.playbackTick = setInterval(this.onPlaybackTick.bind(this), this.tick);
  };

  TranscriptPlayer.prototype.stopPlaybackTick = function() {
    clearInterval(this.playbackTick);
    this.playbackTick = undefined;
  };

  TranscriptPlayer.prototype.onAudioFileLoaded = function() {
    this.playerElement.seekbar.setAttribute("max", this.audioPlayer.duration *
      1000);
  };

  TranscriptPlayer.prototype.onPlayButtonClicked = function(event) {
    var eventType = "pause";
    event.target.classList.toggle("playing");
    event.target.classList.toggle("paused");
    if (event.target.classList.contains("playing")) {
      eventType = "play";
      this.play();
    } else {
      this.pause();
    }
    this.notifyAll(eventType);
  };

  TranscriptPlayer.prototype.onSoundButtonClicked = function(event) {
    var eventType = "mute";
    event.target.classList.toggle("unmuted");
    event.target.classList.toggle("muted");
    if (event.target.classList.contains("unmuted")) {
      eventType = "unmute";
    }
    this.notifyAll(eventType);
  };

  TranscriptPlayer.prototype.onHandleClicked = function(event) {
    return event;
  };

  TranscriptPlayer.prototype.onSeekbarChanged = function(event) {
    this.setPlaybackPosition(event.target.value);
    this.selectCurrentSegment(event.target.value);
  };

  TranscriptPlayer.prototype.play = function() {
    this.audioPlayer.play();
    this.startPlaybackTick();
  };

  TranscriptPlayer.prototype.pause = function() {
    this.audioPlayer.pause();
    this.stopPlaybackTick();
  };

  TranscriptPlayer.prototype.stop = function() {
    this.audioPlayer.pause();
    this.setAudioPosition(0);
    this.stopPlaybackTick();
  };

  //TODO: Bad Wording
  TranscriptPlayer.prototype.setAudioPosition = function(ms) {
    this.audioPlayer.currentTime = ms / 1000;
    this.updateSeekbar(ms);
    this.selectCurrentSegment(ms);
  };

  TranscriptPlayer.prototype.setPlaybackPosition = function(ms) {
    var wasPaused = this.audioPlayer.paused;
    if (!wasPaused) {
      this.audioPlayer.pause();
    }
    this.audioPlayer.currentTime = ms / 1000;
    if (!wasPaused) {
      this.audioPlayer.play();
    }
  };

  TranscriptPlayer.prototype.updateSeekbar = function(progress) {
    this.playerElement.seekbar.value = progress;
  };

  TranscriptPlayer.prototype.selectCurrentSegment = function(ms) {
    var segment = this.findCurrentSegment(ms);
    if (segment === undefined || this.currentSegmentID === segment.id) {
      return;
    }
    this.currentSegmentID = segment.id;
    this.clearSegmentHighlights();
    this.hightlightSegment(segment.id);
  };

  //TODO: Use Lookup
  TranscriptPlayer.prototype.findCurrentSegment = function(currentTime) {
    var i, segment;
    for (i = 0; i < this.segments.length; i++) {
      segment = this.segments[i];
      if (segment.start < currentTime && segment.end >= currentTime) {
        return segment;
      }
    }
    return undefined;
  };

  TranscriptPlayer.prototype.clearSegmentHighlights = function() {
    var i,
      segments = this.playerElement.viewer.querySelectorAll(
        ".transcript-player-segment");
    this.currentSegmentID = undefined;
    for (i = 0; i < segments.length; i++) {
      segments[i].classList.remove("highlighted");
    }
  };

  TranscriptPlayer.prototype.hightlightSegment = function(segmentID) {
    this.currentSegmentID = segmentID;
    this.playerElement.viewer.querySelector(
      "#segment-" + segmentID).classList.add("highlighted");

  };

  TranscriptPlayer.prototype.renderSegments = function() {
    var i,
      viewer = this.playerElement.viewer,
      wrapper,
      segment,
      propertyName,
      wrapperContent;

    for (i = 0; i < this.segments.length; i++) {
      segment = this.segments[i];
      wrapperContent = this.segmentTemplate;
      wrapper = document.createElement("span");
      for (propertyName in segment) {
        if (segment.hasOwnProperty(propertyName)) {
          wrapperContent = wrapperContent.replace("{{" + propertyName +
            "}}",
            segment[propertyName]);
        }
      }
      wrapper.innerHTML = wrapperContent;
      wrapper.querySelector(".handle").addEventListener("click", this.onHandleClicked
        .bind(this));
      wrapper.children[0].id = "segment-" + segment.id;
      viewer.appendChild(wrapper.children[0]);
    }
  };

  TranscriptPlayer.prototype.setFile = function(file) {
    this.audioPlayer.src = file;
    this.audioPlayer.addEventListener("loadeddata", this.onAudioFileLoaded.bind(
      this));
  };

  TranscriptPlayer.prototype.setSegmentTemplate = function(template) {
    this.segmentTemplate = template;
  };

  //TODO: Change wording for audioFile and segments
  /*
   * segments should be an array containing objects with at least the following properties: id (unique in this array), start (segmentation start point in ms) and end 
   */
  TranscriptPlayer.prototype.loadTranscript = function(audioFile, segments) {
    this.audio = audioFile;
    this.segments = segments;
    this.setFile(audioFile);
    this.renderSegments();
  };

  context.TranscriptPlayer = TranscriptPlayer;
}(window));
