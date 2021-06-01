import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {


  transform(arr: any[], filtro: any, column: string, sort: string): any[]{

    if (  arr.length === 0) {
    return ;
    } else {
      let items = [];
        arr.filter(item => {
          if(item[column] === filtro){
            items.push(item)
          }
      });
      return items.sort((a, b) => { return ( a[sort].localeCompare(b[sort])); });;
    }
  }
}