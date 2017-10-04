import * as moment from 'moment';

export enum DATE_RANGE_PATTERN {
  今日,
  昨日,
  直近７日間,
  直近30日間,
  今月,
  先月,
  期間指定
}

const DateRange = {
  of(pattern: string, dateFrom: Date, dateTo: Date) {
    const sysdate: moment.Moment = moment();

    const todayStart: moment.Moment = sysdate.clone().startOf('day');
    const todayEnd: moment.Moment = sysdate.clone().endOf('day');

    const p = Number(pattern);

    if (p === DATE_RANGE_PATTERN.今日 ) {
      return {
        dateFrom: todayStart.toDate(),
        dateTo  : todayEnd.toDate()
      };
    }
    if (p === DATE_RANGE_PATTERN.昨日 ) {
      const yesterdayStart: moment.Moment = todayStart.clone().add(-1, 'day');
      const yesterdayEnd: moment.Moment = todayEnd.clone().add(-1, 'day');

      return {
        dateFrom: yesterdayStart.toDate(),
        dateTo  : yesterdayEnd.toDate()
      };
    }
    if (p ===  DATE_RANGE_PATTERN.直近７日間) {
      const last7dayStart: moment.Moment = todayStart.clone().add(-7, 'day');

      return {
        dateFrom: last7dayStart.toDate(),
        dateTo  : todayEnd.toDate()
      };
    }
    if (p === DATE_RANGE_PATTERN.直近30日間) {
      const last30dayStart: moment.Moment = todayStart.clone().add(-30, 'day');

      return {
        dateFrom: last30dayStart.toDate(),
        dateTo  : todayEnd.toDate()
      };
    }
    if (p === DATE_RANGE_PATTERN.今月) {
      const thisMonthStart = todayStart.clone().startOf('month');

      return {
        dateFrom: thisMonthStart.toDate(),
        dateTo  : todayEnd.toDate()
      };
    }
    if (p === DATE_RANGE_PATTERN.先月) {
      const lastMonthStart = todayStart.clone().add(-1, 'month').startOf('month');
      const lastMonthEnd = todayStart.clone().add(-1, 'month').endOf('month');

      return {
        dateFrom: lastMonthStart.toDate(),
        dateTo  : lastMonthEnd.toDate()
      };
    }
    if (p === DATE_RANGE_PATTERN.期間指定) {
      return { dateFrom, dateTo };
    }
  }
};

export { DateRange };
