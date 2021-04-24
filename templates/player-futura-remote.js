const DEFAULT_STREAM_URL = 'https://streamer.fmfutura.com.ar/vivo.mp3';


class FuturaPlayerHeadless {
  constructor (streamUrl=DEFAULT_STREAM_URL) {
    this.playerState = {
      streamUrl,
      playing: false,
      loading: false,
    };
    this.currentShow = {};

    let eventNames = {
      error: ['error', 'ended', 'offline', 'reset', 'cancel', 'close', 'abort', 'pause'],
      play: ['playing'],
      loading: ['loadstart'],
    };

    let audio = new Audio();
    this.audio = audio;
    audio.preload = 'none';
    audio.loop = false;
    audio.autoplay = false;

    let currentShowProvider = new FuturaCurrentShow();
    this.currentShowProvider = currentShowProvider;


    eventNames.error.forEach((eventName) => {
      audio.addEventListener(eventName, () => {
        this.playerState.playing = false;
        this.playerState.loading = false;
        this.dispatchPlayerUpdate('stop');
      });
    });

    audio.addEventListener('loadstart', () => {
      this.playerState.playing = false;
      let loading = this.playerState.loading = !!audio.src;
      if (loading) {
        this.dispatchPlayerUpdate('loading');
      }
    });

    audio.addEventListener('playing', () => {
      this.playerState.playing = true;
      this.playerState.loading = !audio.src;
      this.dispatchPlayerUpdate('play');
    });

    window.addEventListener('futura-player::control::toggle', () => this.toggle());
    window.addEventListener('futura-player::control::play', () => this.play());
    window.addEventListener('futura-player::control::stop', () => this.stop());

    setInterval(() => this.updateCurrentShow(), 60*1000);
    setInterval(() => this.updateSchedule(), 30*60*1000);
    this.updateSchedule();
  }

  play () {
    this.audio.src = this.playerState.streamUrl;
    return this.audio.play();
  }

  pause () {
    return this.audio.pause();
  }

  stop  () {
    this.audio.pause();
    this.audio.src = '';
  }

  toggle () {
    if (this.playerState.loading) {
      return;
    }

    if (this.playerState.playing) {
      this.stop();
    } else {
      this.play();
    }
  }

  dispatchPlayerUpdate (type='update') {
    let event = new CustomEvent(
      `futura-player::${type}`,
      { detail: { data: this.playerState }},
    );
    window.dispatchEvent(event);
  }

  dispatchShowUpdate (type='update') {
    let event = new CustomEvent(
      `futura-player::show::${type}`,
      { detail: { show: this.currentShow }},
    );
    window.dispatchEvent(event);
  }

  updateCurrentShow () {
    this.currentShow = this.currentShowProvider.get();
    this.dispatchShowUpdate();
  }

  async updateSchedule () {
    await this.currentShowProvider.update();
    this.updateCurrentShow();
  }
}


class FuturaPlayerRemote {
  constructor (rootEl) {
    let playerContent = rootEl.querySelector('.player__content');
    let playerControl = rootEl.querySelector('.player__control');
    let currentShow   = rootEl.querySelector('.player__currentshow');

    playerControl.addEventListener('click', () => this.sendCommand('toggle'));

    window.addEventListener('futura-player::loading', (event) => {
      playerContent.classList.remove('playing');
      playerContent.classList.add('loading');
    });

    window.addEventListener('futura-player::play', (event) => {
      playerContent.classList.add('playing');
      playerContent.classList.remove('loading');
    });

    window.addEventListener('futura-player::stop', (event) => {
      playerContent.classList.remove('playing');
      playerContent.classList.remove('loading');
    });

    window.addEventListener('futura-player::show::update', (event) => {
      let show = event.detail.show;
      let title = show?.title || '';
      currentShow.textContent = title;
    });

    this.sendCommand('get-current-show');
  }

  sendCommand (command) {
    let event = new CustomEvent(
      `futura-player::control::${command}`,
    );
    window.dispatchEvent(event);
  }
}

window.__futura_headless_player = new FuturaPlayerHeadless();
