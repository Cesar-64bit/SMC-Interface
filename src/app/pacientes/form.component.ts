import { Component } from '@angular/core';
import { Paciente } from './paciente';
import { PacienteService } from './paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
})
export class FormComponent {
    public paciente: Paciente = new Paciente();
    public titulo: string = "Registrar un nuevo paciente";
    public errores: string[];

    constructor(private pacienteService: PacienteService, private router: Router, private activateRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.cargarPaciente();
    }

    public cargarPaciente(): void {
        this.activateRoute.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.pacienteService.getPaciente(id).subscribe((paciente) => this.paciente = paciente)
            }
        });
    }

    public create(): void {
        this.pacienteService.create(this.paciente)
            .subscribe(paciente => {
                this.router.navigate(['/pacientes']);
                swal.fire('Nuevo Paciente', `Paciente ${paciente.nombre} agregado con éxito!`, 'success');
            },
                err => {
                    this.errores = err.error.errors as string[];
                    console.error('Código del error desde el backend: ' + err.status);
                    console.error(err.error.errors);
                }
            );
    }

    public update(): void {
        this.pacienteService.update(this.paciente)
            .subscribe(paciente => {
                this.router.navigate(['/pacientes']);
                swal.fire('Paciente Actualizado', `Paciente ${paciente.nombre} actualizado con éxito`, 'success');
            },
                err => {
                    this.errores = err.error.errors as string[];
                    console.error('Código del error desde el backend: ' + err.status);
                    console.error(err.error.errors);
                }
            );
    }

    mostrarIndicadores: boolean = false;

    toggleIndicadores() {
        this.mostrarIndicadores = !this.mostrarIndicadores;
    }
}
