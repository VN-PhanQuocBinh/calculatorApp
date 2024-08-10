import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  initExpression = '0'
  expression:string = this.initExpression
  resultExpression:string = '0'
  fontSizeId = 'large'
  // value: string = ''

  calculation = ['+', '-', 'x', '/']
  calculationFunction: {
    [key: string]: Function
  } = {
    '+': (a: number, b: number): string => (a + b) + '',
    '-': (a: number, b: number): string => (a - b) + '',
    'x': (a: number, b: number): string => (a * b) + '',
    '/': (a: number, b: number): string => {
      if (a % b == 0)
        return (a / b) + ''
      else
        return (a/b).toFixed(9) 
    }, 
  }

  rules = [
    this.removeDuplicationCalculation,
    this.handleFirstNumber
  ]

  private expressionSource = new BehaviorSubject<string>('')
  currentExpression = this.expressionSource.asObservable()

  private fontSizeIdSource = new BehaviorSubject<string>('')
  currentFontSizeId = this.fontSizeIdSource.asObservable()

  private resultExpressionSource = new BehaviorSubject<string>('')
  currentResultExpression = this.resultExpressionSource.asObservable()

  constructor() {
    this.setFontSizeId(this.fontSizeId)
    this.expressionSource.next(this.expression)
    this.setResultExpression(this.resultExpression)
  }

  setExpression(expression: string) {
    this.expressionSource.next(expression)
  }

  setFontSizeId(fontSizeId: string) {
    this.fontSizeIdSource.next(fontSizeId)
  }

  setResultExpression(resultExpression: string) {
    this.resultExpressionSource.next(resultExpression)
  }

  calculate(expression: string): string {

    // check if lastChar is calculation, ....
    let tmpExpression = ''
    if (this.calculation.includes(expression[expression.length - 1])) {
      tmpExpression = expression.slice(0, expression.length - 1)
    } else {
      tmpExpression = expression
    }

    // replace %
    if (tmpExpression.includes('%'))
      tmpExpression = tmpExpression.replace('%', 'x0.01')

    console.log(tmpExpression)
    
    let result: string = '';
    let calculationArray: string[] = []
    let numberArray: string[] = []
    const len = tmpExpression.length

    // convert to Array
    for (let i = 0; i < len; i++) {
      let char = tmpExpression[i]

      if (this.calculation.includes(char)) {
        calculationArray.push(char)
        tmpExpression = tmpExpression.replace(char, '|')
      }
    }

    numberArray = tmpExpression.split('|')

    // calculate
    // 'x' | '/'
    let i = 0
    while (i < calculationArray.length) {
      let calculateChar = calculationArray[i]

      if (calculateChar === 'x' || calculateChar === '/') {
        let result = this.calculationOfTwoNumber(numberArray[i], numberArray[i+1], calculateChar)

        calculationArray.splice(i, 1)
        numberArray[i] = result
        numberArray.splice(i + 1, 1)
      } else i++;
    }


    // '+' | '-'
    i = 0
    while (i < calculationArray.length) {
      let calculateChar = calculationArray[i]
      let result = this.calculationOfTwoNumber(numberArray[i], numberArray[i+1], calculateChar)

      calculationArray.splice(i, 1)
      numberArray[i] = result
      numberArray.splice(i + 1, 1)
    }

    // return value of result
    result = numberArray.join('')
    return result
  }

  calculationOfTwoNumber(a: string, b: string, calculate: string): string {
    let result = ''

    result = this.calculationFunction[calculate](Number(a), Number(b))
    return result
  }


  appendToExpression(value: string): void {
    this.rules.forEach((rule) => {
      this.expression = rule.bind(this)(this.expression, value)
    })
    // this.expression = this.removeDuplicationCalculation(this.expression, value)

    this.expression = (this.expression + value).substring(0, 30)
    this.resultExpression = this.calculate(this.expression)

    this.updateFontSizeId(this.expression)
    this.setExpression(this.expression)
    this.setResultExpression(this.resultExpression)
  }

  removeExpression() {
    this.expression = this.expression.substr(0, this.expression.length - 1)

    if (this.expression.length == 0)
      this.expression = this.initExpression

    this.resultExpression = this.calculate(this.expression)

    this.setExpression(this.expression)
    this.setResultExpression(this.resultExpression)
  }

  removeAllExpression() {
    this.expression = this.initExpression
    this.resultExpression = '0'

    this.setExpression(this.expression)
    this.setResultExpression(this.resultExpression)
  }

  removeDuplicationCalculation(expression: string, newValue: string): string {
    let newExpression = expression
    const len = newExpression.length

    if (this.calculation.includes(newExpression[len - 1]) &&
        this.calculation.includes(newValue)
    ) {
      let expressionArray = [...newExpression]
      expressionArray.splice(len - 1, 1)
      newExpression = expressionArray.join('')
    }

    // newExpression = (newExpression + newValue).substring(0, 30)
    return newExpression
  }

  handleFirstNumber(expression: string, newValue: string): string {
    let newExpression = expression
    const len = newExpression.length
    
    if (len == 1 && newExpression[0] === '0') {
      if (!this.calculation.includes(newValue) && newValue !== '.') {
        newExpression = ''
      }
    }
    return newExpression
  }

  updateFontSizeId(expression: string): void {
    const len = expression.length

    if (len >= 20) {
      this.fontSizeId = 'small'
    } else if (len >= 15) {
      this.fontSizeId = 'medium'
    } else {
      this.fontSizeId = 'large'
    }

    this.fontSizeIdSource.next(this.fontSizeId)
  }
  
}
