import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform(arr: any[], sort: string): any[]{
    if (  arr.length === 0) {
    return ;
    } else {
      return arr.sort((a, b) => { return ( a[sort].localeCompare(b[sort])); });;
    }
  }
}