import { Directive, HostListener, Input } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Directive({
  selector: '[appCalculatorButton]',
  standalone: true
})
export class CalculatorButtonDirective {

  @Input() value: string = ''

  constructor(private calculatorService: CalculatorService) {}

  @HostListener('click') onClick() {
    this.calculatorService.appendToExpression(this.value)
  }
}
