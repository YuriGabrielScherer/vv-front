import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascaraCpf'
})
export class MascaraCpfPipe implements PipeTransform {

  transform(cpf: string): string {
    // Inserindo mascara
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    // Retornando
    return cpf;
  }

}
