import moment from 'moment';

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
    ? (type = 'Good Morning')
    : time.isBetween(befoNo, afterNo)
    ? (type = 'Good Afternoon')
    : time.isBetween(befoEv, afterEv)
    ? (type = 'Good Evening')
    : time.isBetween(befoNi, afterNi) && (type = 'Good Night');

  return type;
};
