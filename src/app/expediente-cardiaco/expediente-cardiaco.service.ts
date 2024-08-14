import { Injectable } from "@angular/core";
import { ExpedienteCardiaco } from "./expediente-cardiaco";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ExpedienteCardiacoService {
    private urlEndPoint: string = 'http://localhost:8080/api/info-cardiaca';
    //private urlEndPointMongo: string = 'http://localhost:8081/api/all-data';
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

    // getAllData(): Observable<ExpedienteCardiaco[]> {
    //     return this.http.get<ExpedienteCardiaco[]>(`${this.urlEndPointMongo}`).pipe(
    //         catchError(e => {
    //             console.error('Error fetching expediente-cardiaco', e);
    //             return of([] as ExpedienteCardiaco[]);
    //         })
    //     );
    // }
}