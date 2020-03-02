import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Utils {
    constructor() {
    }
    letrasNumeros($event: KeyboardEvent) {
        let value = ($event.target as HTMLInputElement).value;
        if ($event.target) {
          if (value === '') {
            value = value.slice(0, 0);
          }
          if (value.length > 100) {
            value = value.slice(0, 100);
          }
          ($event.target as HTMLInputElement).value = value.replace(/[^ÑA-ñfZa-z0-9\s]+/g, '');
        }
    }

    letras($event: KeyboardEvent) {
      const value = ($event.target as HTMLInputElement).value;
      if ($event.target) {
        ($event.target as HTMLInputElement).value = value.replace(/[^ÑA-ñfZa-z\s]+/g, '');
      }
  }
  numeros($event: KeyboardEvent) {
    const value = ($event.target as HTMLInputElement).value;
    if ($event.target) {
      ($event.target as HTMLInputElement).value = value.replace(/[^1-5\.]+/g, '');
      ($event.target as HTMLInputElement).value = value.replace(/[^-.\s]+/g, '');
    }
}
numerosp($event: KeyboardEvent) {
  const value = ($event.target as HTMLInputElement).value;
  if ($event.target) {
    ($event.target as HTMLInputElement).value = value.replace(/[^-.0-9\s]+/g, '');
  }
}

letrasCaracteres($event: KeyboardEvent) {
    const value = ($event.target as HTMLInputElement).value;
    if ($event.target) {
    ($event.target as HTMLInputElement).value = value.replace(/[^ÑA-ñfZa-z0-9-ó-ú-,._':;\s]+/g, '');
  }

}
}
