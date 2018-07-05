import * as moment from 'moment';

export function formatPostDate(val: number): string {
  let posted = "Posted ";
  if(moment(val) > moment()) posted = "Will have been posted "
  if(moment().valueOf() == val) return posted + 'today';
  return posted + moment(val).fromNow();
}

export function generateRandomPlaceholderImage(): string {
  return `/assets/plc${ Math.ceil(Math.random() * 10)}.png`;
}
