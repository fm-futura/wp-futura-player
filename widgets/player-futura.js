function FuturaPlayer(rootEl) {

  var playerContent = this.playerContent = rootEl.querySelector('.player__content');
  var playerControl = this.playerControl = rootEl.querySelector('.player__control');
  var currentShow   = this.currentShow   = rootEl.querySelector('.player__currentshow');
  var playerState = this.playerState = {
    playing: false,
    loading: false,
    streamUrl: 'https://streamer.fmfutura.com.ar/vivo.mp3',
    audio: null,
  };

  var eventNames = this.eventNames = {
    error: ['error', 'ended', 'suspend', 'offline', 'reset', 'cancel', 'close', 'abort', 'pause'],
    play: ['playing'],
    loading: ['loadstart'],
  }

  var eventHandlers = this.eventHandlers = {};

  playerControl.addEventListener('click', this.toggle.bind(this));

  eventHandlers.play = (function () {
    this.playerState.playing = true;
    this.playerState.loading = false;
    this.playerContent.classList.add('playing');
    this.playerContent.classList.remove('loading');
  }).bind(this);

  eventHandlers.loading = (function () {
    this.playerState.loading = true;
    this.playerContent.classList.add('loading');
  }).bind(this);

  eventHandlers.stop = (function () {
    this.playerState.playing = false;
    this.playerState.loading = false;
    this.playerContent.classList.remove('playing');
    this.playerContent.classList.remove('loading');
    this.destroyAudio();
  }).bind(this);
}

FuturaPlayer.prototype.play = function () {
  this.setupAudio();
  this.playerState.audio.play();
}

FuturaPlayer.prototype.pause = function () {
  return this.stop();
}

FuturaPlayer.prototype.stop = function () {
  if (this.playerState.audio) {
    this.playerState.audio.pause();
  }
}

FuturaPlayer.prototype.toggle = function () {
  if (this.playerState.loading) {
    return;
  }

  if (this.playerState.playing) {
    this.pause();
  } else {
    this.play();
  }
}

FuturaPlayer.prototype.destroyAudio = function () {
  if (this.playerState.audio) {
    var audio = this.playerState.audio;
    var eventHandlers = this.eventHandlers;
    var eventNames = this.eventNames;

    eventNames.play.forEach(function (name) {
      audio.removeEventListener(name, eventHandlers.play);
    });
    eventNames.error.forEach(function (name) {
      audio.removeEventListener(name, eventHandlers.stop);
    });
    eventNames.loading.forEach(function (name) {
      audio.removeEventListener(name, eventHandlers.loading);
    });

    audio.src = '';
    this.playerState.audio = null;
  }
}

FuturaPlayer.prototype.setupAudio = function () {
  this.destroyAudio();

  var audio = this.playerState.audio = new Audio();

  audio.preload = 'none';
  audio.loop = false;
  audio.autoplay = false;

  var eventHandlers = this.eventHandlers;
  var eventNames = this.eventNames;

  eventNames.play.forEach(function (name) {
    audio.addEventListener(name, eventHandlers.play);
  });
  eventNames.error.forEach(function (name) {
    audio.addEventListener(name, eventHandlers.stop);
  });
  eventNames.loading.forEach(function (name) {
    audio.addEventListener(name, eventHandlers.loading);
  });

  audio.src = 'https://streamer.fmfutura.com.ar/vivo.mp3';
}
