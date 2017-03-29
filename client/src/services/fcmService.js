import moment from 'moment';
import FCM from 'react-native-fcm';
import { isUpcoming } from '../utils/common';

import { colors } from '../styles/common';

const defaultNotifOptions = {
  color: colors.APP_PRIMARY_LIGHT,
  icon: 'ic_stat_name',
  lights: true,
  priority: 'high',
  show_in_foreground: true,
  sound: 'default'
};

export function scheduleNotifs(events) {
  for (let event of events) {
    scheduleNotif(event);
  }
}

export function scheduleNotif(event) {
  const { id, event_detail } = event;
  const { datetime, name, restaurant } = event_detail;

  if (!restaurant) return;

  const dayBefore = moment(datetime).subtract(1, 'day');
  const hourBefore = moment(datetime).subtract(1, 'hour');
  const datetimeStr = moment(datetime).format('h:mm A');

  const dayId = `${id}_1_DAY`;
  const hourId = `${id}_1_HOUR`;

  const dayOptions = {
    fire_date: dayBefore.toDate().getTime(),
    id: dayId,
    title: `Upcoming Event: ${name}`,
    body: `Scheduled tomorrow at ${datetimeStr} at ${restaurant.name}`,
    ...defaultNotifOptions
  };

  const hourOptions = {
    fire_date: hourBefore.toDate().getTime(),
    id: hourId,
    title: `Upcoming Event: ${name}`,
    body: `${name} starts in 1 hour at ${datetimeStr} at ${restaurant.name}`,
    ...defaultNotifOptions
  }

  // If event already occurred or within an hour of the event...
  if (!isUpcoming(event) || !hourBefore.isSameOrAfter(moment(new Date()))) {
    FCM.cancelLocalNotification(hourId);
    FCM.cancelLocalNotification(dayId);
    return;
  }

  // If within a day of the event...
  else if (!dayBefore.isSameOrAfter(moment(new Date()))) {
    FCM.cancelLocalNotification(dayId);
    FCM.scheduleLocalNotification(hourOptions);
    return;
  }

  else {
    FCM.scheduleLocalNotification(hourOptions);
    FCM.scheduleLocalNotification(dayOptions);
  }
}

export default FCM;
