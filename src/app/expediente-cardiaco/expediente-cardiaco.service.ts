import { Injectable } from "@angular/core";
import { ExpedienteCardiaco } from "./expediente-cardiaco";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class ExpedienteCardiacoService {
    private urlEndPoint: string = 'http://localhost:8080/api/info-cardiaca';
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    getByPacienteId(id: number): Observable<ExpedienteCardiaco[]> {
        return this.http.get<ExpedienteCardiaco[]>(`${this.urlEndPoint}/${id}`).pipe(
            catchError(e => {
                console.error('Error fetching expediente-cardiaco', e);
                return of([] as ExpedienteCardiaco[]);
            })
        );
    }
}