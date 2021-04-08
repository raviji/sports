import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
          console.log(items, filter);
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // return items.filter(item => item.indexOf(filter) !== -1);
    }
}
