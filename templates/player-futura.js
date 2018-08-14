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


function FuturaCurrentShow() {
  var state = this.state = {
    schedule_url: 'https://fmfutura.com.ar/grilla-json',
    last_update: null,
    rawData: null,
    showsByDay: [],
  };

  for (var day = 0; day < 7; day++) {
    state.showsByDay[day] = [];
  }

  this.parseScheduleData = function (rawData) {
    state.rawData = rawData;
    showsByDay = state.showsByDay;

    showsByDay.forEach(function(dayData) {
      dayData.length = 0;
    });

    rawData.forEach(function (showData) {
      var weekStart = moment().startOf('week');
      var start = parseTime(showData.horario_inicio);
      var end = parseTime(showData.horario_finalizacion);

      if (end.hour === 0 && end.minutes === 0) {
        end.hour = 23;
        end.minutes = 59;
      }

      for (var idx=0; idx < showData.dia.length; idx++) {
        var day = showData.dia[idx];
        // maps 1 - 7 to 1 - 0
        day = day % 7;

        var dateStart = moment(weekStart).add(day, 'days').set(start);
        var dateEnd   = moment(weekStart).add(day, 'days').set(end);

        var show = {
          start: dateStart,
          end: dateEnd,
          title: showData.title.rendered || showData.title,
          url: showData.link,
        };

        showsByDay[day].push(show);
      }
    });

    state.last_update = moment();

    function parseTime (time) {
      var parts = time.split(':');
      return {
        hour: parseInt(parts[0]),
        minutes: parseInt(parts[1]),
        seconds: 0,
      };
    }
  }
}

FuturaCurrentShow.prototype.update = function () {
  var self = this;
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', self.state.schedule_url);
    xhr.addEventListener('error', function () {
      reject(xhr.statusText);
    });

    xhr.addEventListener('load', function () {
      var raw = JSON.parse(xhr.responseText);
      self.parseScheduleData(raw);
      resolve();
    });

    xhr.send();
  });
}

FuturaCurrentShow.prototype.get = function getCurrentShow (when) {
    when = moment(when);
    var day = when.weekday();

    var todayShows = this.state.showsByDay[day];

    for (var idx=0; idx < todayShows.length; idx++) {
      var show = todayShows[idx];
      if (when.isBetween(show.start, show.end)) {
        return show;
      }
    }

    return null;
}
