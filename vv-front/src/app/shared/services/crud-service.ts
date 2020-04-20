import { HttpClient } from '@angular/common/http';
import { take, delay } from 'rxjs/operators';


export class CrudService<Type> {

  constructor(
    protected http: HttpClient,
    private API_URL
  ) { }

  // Metodo Generico de Listar Dados
  list() {
    return this.http.get<Type[]>(this.API_URL)
      .pipe(
        take(1)
      );
  }

  // Metodo Generico para retornar um dado
  loadById(id: number) {
    return this.http.get<Type>(`${this.API_URL}/${id}`).pipe(take(1));
  }

  // Metodo Generico para Criacao
  private create(record: Type) {
    return this.http.post(`${this.API_URL}/cadastrar`, record).pipe(take(1));
  }

  // Metodo Generico para Atualizacao
  public update(record: Type) {
    return this.http.put(`${this.API_URL}/alterar`, record).pipe(take(1));
  }

  // Metodo Publico para salvar
  save(record: Type) {
    // Conferindo Update ou Create
    if (record['id']) {
      return this.update(record);
    }

    return this.create(record);
  }

  // Metodo Generico para Exclusao
  removeById(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(take(1));
  }

}
