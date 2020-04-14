import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeiroNome'
})
export class PrimeiroNomePipe implements PipeTransform {

  transform(value: string): string {

    // Var para separar
    let array: string[];
    // Separando e retomando o primeiro nome
    if (value) {
      array = value.split(' ');
      return array[0];
    }

  }

}
