import moment from 'moment';
import R from '../res/R';

const format = 'HH:mm';

export const TimeType = () => {
  let type = 'Good Morning';
  let timeNow = moment()
    .local(true)
    .format(format);
  const time = moment(timeNow, format);
  const befoMo = moment('00:00', format);
  const afterMo = moment('12:00', format);

  const befoNo = moment('12:01', format);
  const afterNo = moment('16:00', format);

  const befoEv = moment('16:01', format);
  const afterEv = moment('20:00', format);

  const befoNi = moment('20:01', format);
  const afterNi = moment('23:59', format);

  time.isBetween(befoMo, afterMo)
    ? (type = R.locale.morning)
    : time.isBetween(befoNo, afterNo)
    ? (type = R.locale.afternoon)
    : time.isBetween(befoEv, afterEv)
    ? (type = R.locale.evening)
    : time.isBetween(befoNi, afterNi) && (type = R.locale.night);

  return type;
};
