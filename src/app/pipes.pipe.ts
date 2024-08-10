import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixResultExpression',
  standalone: true
})
export class fixResultExpressionPipe implements PipeTransform {
  calculation:string[] = ['+', '-', 'x', '/']

  transform(value: string): string {
    let newValue: string = value

    newValue = newValue.replace('/', '÷')
    newValue = newValue.replace('x', '×')
    newValue = newValue.replace('-', '−')

    return newValue
  }

}
