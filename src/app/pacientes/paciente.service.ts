import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Paciente } from './paciente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/pacientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getPacientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('PacienteService: tap 1');

        (response.content as Paciente[]).forEach(paciente => {
          console.log(paciente.nombre)
        })
      }),
      map((response: any) => {
        (response.content as Paciente[]).map(paciente => {
          let datePipe = new DatePipe('es');
          paciente.fechaNacimiento = datePipe.transform(paciente.fechaNacimiento, 'EEEE dd, MMMM yyyy');//formatDate(paciente.fechaNacimiento, 'dd-MM-yyyy', 'en-US');

          return paciente;
        });
        return response;
      }),
      tap(response => {
        console.log('PacienteService: tap 2');

        (response.content as Paciente[]).forEach(paciente => {
          console.log(paciente.nombre)
        })
      })
    );
  }

  create(paciente: Paciente): Observable<Paciente> {
    return this.http.post(this.urlEndPoint, paciente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.paciente as Paciente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire('Error al crear paciente', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/pacientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  update(paciente: Paciente): Observable<Paciente> {
    return this.http.put(`${this.urlEndPoint}/${paciente.id}`, paciente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.paciente as Paciente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire('Error al editar paciente', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Paciente> {
    return this.http.delete<Paciente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al eliminar paciente', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }
}
