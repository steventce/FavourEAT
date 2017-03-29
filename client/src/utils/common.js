import moment from 'moment';

export function isUpcoming(event) {
  return moment(event.event_detail.datetime).isSameOrAfter(moment(new Date()));
}
