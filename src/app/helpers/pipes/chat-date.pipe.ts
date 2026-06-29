import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {
  transform(
    value: string,
    mode: 'group' | 'message' = 'group'
  ): string {

    const date = DateTime.fromISO(value, { zone: 'utc' })
      .toLocal()
      .setLocale('ru');
    const now = DateTime.now();

    if (mode === 'message') {
      const hours = now.diff(date, 'hours').hours;

      if (hours < 24) {
        return date.toFormat('HH:mm');
      }
    }

    if (date.hasSame(now, 'day')) {
      return 'Сегодня';
    }

    if (date.hasSame(now.minus({ days: 1 }), 'day')) {
      return 'Вчера';
    }

    if (date.hasSame(now, 'year')) {
      return date.toFormat('d MMMM');
    }

    return date.toFormat('d MMMM yyyy');
  }
}
