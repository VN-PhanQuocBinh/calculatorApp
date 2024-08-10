import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { CalculatorService } from './calculator.service';
import { CalculatorButtonDirective } from './calculator-button.directive';
import { fixResultExpressionPipe } from './pipes.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    FontAwesomeModule, 
    CalculatorButtonDirective,
    fixResultExpressionPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'calculator';
  faDelete = faBackspace

  expression:string = ''
  resultExpression: string = ''
  fontSizeId: string = ''

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit() {
    this.calculatorService.currentExpression.subscribe(expression => {
      this.expression = expression
    })

    this.calculatorService.currentFontSizeId.subscribe(fontSizeId => {
      this.fontSizeId = fontSizeId
    })

    this.calculatorService.currentResultExpression.subscribe(resultExpression => {
      this.resultExpression = resultExpression
    })
  }

  removeExpression() {
    this.calculatorService.removeExpression()
  }

  removeAllExpression() {
    this.calculatorService.removeAllExpression()
  }

}
