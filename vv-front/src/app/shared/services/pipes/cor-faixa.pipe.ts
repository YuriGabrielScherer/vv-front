import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'corFaixa'
})

export class CorFaixaPipe implements PipeTransform {

  transform(idFaixa: number): string {
    switch (idFaixa) {
      case 1: {
        return 'Branca';
      }
      case 2: {
        return 'Amarela';
      }
      case 3: {
        return 'Vermelha';
      }
      case 4: {
        return 'Laranja';
      }
      case 5: {
        return 'Verde';
      }
      case 6: {
        return 'Roxa';
      }
      case 7: {
        return 'Marrom';
      }
      case 8: {
        return 'Preta';
      }
      default: {
        return 'Branca';
      }
    }
  }
}
