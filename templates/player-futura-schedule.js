const DEFAULT_SCHEDULE_URL = '/grilla-json';

class FuturaCurrentShow {
  constructor (scheduleUrl=DEFAULT_SCHEDULE_URL) {
    let state = this.state = {
      scheduleUrl,
      last_update: null,
      rawData: null,
      showsByDay: [],
    };

    for (let day = 0; day < 7; day++) {
      state.showsByDay[day] = [];
    }
  }

  get (when) {
    when = moment(when);
    let day = when.weekday();

    let todayShows = this.state.showsByDay[day];
    let show = todayShows.find((show) => when.isBetween(show.start, show.end));

    return show;
  }

  update () {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', this.state.scheduleUrl);
      xhr.addEventListener('error', () => reject(xhr.statusText));

      xhr.addEventListener('load', () => {
        let raw = JSON.parse(xhr.responseText);
        this.parseScheduleData(raw);
        resolve();
      });

      xhr.send();
    });
  }

  parseScheduleData (rawData) {
    let state = this.state;

    state.rawData = rawData;
    let showsByDay = state.showsByDay;

    showsByDay.forEach((dayData) => dayData.length = 0);

    rawData.forEach((showData) => {
      let weekStart = moment().startOf('week');
      let start = parseTime(showData.horario_inicio);
      let end = parseTime(showData.horario_finalizacion);

      if (end.hour === 0 && end.minutes === 0) {
        end.hour = 23;
        end.minutes = 59;
      }

      let showDays = showData.dia;
      if (!Array.isArray(showDays)) {
        showDays = [showDays];
      }

      showDays.forEach((day) => {
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
      });
    });

    state.last_update = moment();

    function parseTime (time) {
      let parts = time.split(':');
      return {
        hour: parseInt(parts[0]),
        minutes: parseInt(parts[1]),
        seconds: 0,
      };
    }
  }
}
