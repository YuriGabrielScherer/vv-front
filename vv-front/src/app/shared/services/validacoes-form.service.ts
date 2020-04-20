import { AbstractControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacoesFormService {


  constructor() { }

  public maskTelefone = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  // Validacao de CPF
  isValidCpf() {

    let cpf = null;

    return (control: AbstractControl): Validators => {
      const cpfAntigo = control.value;

      if (cpfAntigo != null) {
        cpf = cpfAntigo.replace(/[^0-9]+/g, '');
      }

      // console.log(cpf);
      if (cpf) {

        let numbers;
        let digits;
        let sum;
        let i;
        let result;
        let equalDigits;

        equalDigits = 1;
        if (cpf.length < 11) {
          return { cpfNotValid: true };
        }

        for (i = 0; i < cpf.length - 1; i++) {
          if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
            equalDigits = 0;
            break;
          }
        }

        if (!equalDigits) {
          numbers = cpf.substring(0, 9);
          digits = cpf.substring(9);
          sum = 0;
          for (i = 10; i > 1; i--) {
            sum += numbers.charAt(10 - i) * i;
          }

          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(0))) {
            return { cpfNotValid: true };
          }
          numbers = cpf.substring(0, 10);
          sum = 0;

          for (i = 11; i > 1; i--) {
            sum += numbers.charAt(11 - i) * i;
          }
          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(1))) {
            return { cpfNotValid: true };
          }
          return null;
        } else {
          return { cpfNotValid: true };
        }
      }
      return null;
    };

  }

  isValidPhone() {

    // Retornando o Telefone
    return (control: AbstractControl): Validators => {
      const telefone: string = control.value;

      // Validando
      const regex = new RegExp('^\\([0-9]{2}\\)(9[0-9]{4}-[0-9]{4})$');

      if (regex.test(telefone) === false) {
        return { phoneNotValid: true };
      }
      return null;
    };
  }

  isValidDate() {
    return (control: AbstractControl): Validators => {
      if (!control === undefined) {
        const dia = control.value.slice(0, 2) as unknown as number;
        const mes = control.value.slice(3, 5) as unknown as number;
        const ano = control.value.slice(6, 10) as unknown as number;

        if ((dia <= 0 || dia >= 32) || (mes <= 0 || mes >= 13)) {
          return { dateNotValid: true };
        }
      }
      return null;
    };
  }

  // Validacao de Erro do Campo CPF
  aplicaCssCpf(campoCpf: AbstractControl) {

    // Var Auxiliar
    let digitos = '';

    // Retirando mascara
    if (campoCpf.value) {
      digitos = (campoCpf.value).replace(/[^0-9]+/g, '');
    }

    // Verificando tamanho do CPF
    if (digitos.length === 11) {

      // Verificando Valido
      return {
        'is-valid': campoCpf.errors == null,
        'is-invalid': campoCpf.errors
      };
    } else {
      return {
        'is-invalid': campoCpf.touched
      };
    }
  }

  // Retorna valor para aplicar na Class do Input
  aplicaCss(campo: AbstractControl) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'is-valid': !this.verificaValidTouched(campo) && (campo.touched),
    };
  }

  // Verificando se o campo está invalido e se foi Focado
  verificaValidTouched(campo: AbstractControl) {
    if (!campo.enabled) {
      // console.log('if enabled');
      return false;
    }
    return !campo.valid && campo.touched;
  }

  transformarDataToBanco(data: string) {
    // Transformar no formato yyyy-mm-dd, ja que o backend trabalha assim.
    const dia = data.slice(0, 2);
    const mes = data.slice(3, 5);
    const ano = data.slice(6, 10);
    const dataN = `${ano}-${mes}-${dia}`;
    return dataN;
  }

  transformarDataToSite(data: string) {
    // Transformar para o formato dd-mm-yyyy, ja que o front trabalha assim
    const ano = data.slice(0, 4);
    const mes = data.slice(5, 7);
    const dia = data.slice(8, 10);
    const dataN = `${dia}-${mes}-${ano}`;
    return dataN;
  }
}
