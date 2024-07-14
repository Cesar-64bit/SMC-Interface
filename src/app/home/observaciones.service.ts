import { Injectable } from "@angular/core";
import { Observaciones } from './observaciones';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class ObservacionesService {
    private urlEndPoint: string = 'http://localhost:8080/api/info';
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    create(observaciones: Observaciones): Observable<Observaciones> {
        return this.http.post(this.urlEndPoint, observaciones, { headers: this.httpHeaders }).pipe(
            map((response: any) => response.observaciones as Observaciones),
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }

                console.error(e.error.mensaje);
                swal.fire('Error al agregar observación', e.error.mensaje, 'error');
                return throwError(() => e);
            })
        );
    }
}