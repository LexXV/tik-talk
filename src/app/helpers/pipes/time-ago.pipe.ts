import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }

    // const createdAt = new Date(value);
    /*const createdAt = new Date(value + 'Z');
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000
    );*/

    ///////////

    /*const createdAt = DateTime.fromISO(value, {
      zone: 'utc'
    })
      .toLocal();
    const now = DateTime.now()

    const diffInSeconds = Math.floor(
      now.diff(createdAt, 'seconds').seconds
    );*/

    /*if (diffInSeconds < 60) {
      return 'только что';
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
      return `${minutes} ${this.plural(minutes, [
        'минуту',
        'минуты',
        'минут'
      ])} назад`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${this.plural(hours, [
        'час',
        'часа',
        'часов'
      ])} назад`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} ${this.plural(days, [
        'день',
        'дня',
        'дней'
      ])} назад`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 5) {
      return `${weeks} ${this.plural(weeks, [
        'неделю',
        'недели',
        'недель'
      ])} назад`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months} ${this.plural(months, [
        'месяц',
        'месяца',
        'месяцев'
      ])} назад`;
    }

    const years = Math.floor(days / 365);

    return `${years} ${this.plural(years, [
      'год',
      'года',
      'лет'
    ])} назад`;*/

    return DateTime.fromISO(value, { zone: 'utc' })
      .toLocal()
      .setLocale('ru')
      .toRelative() ?? '';
  }

  /*private plural(
    value: number,
    forms: [string, string, string]
  ): string {
    const num = Math.abs(value) % 100;
    const lastDigit = num % 10;

    if (num > 10 && num < 20) {
      return forms[2];
    }

    if (lastDigit > 1 && lastDigit < 5) {
      return forms[1];
    }

    if (lastDigit === 1) {
      return forms[0];
    }

    return forms[2];
  }*/
}
