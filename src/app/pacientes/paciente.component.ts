import { Component } from '@angular/core';
import { Paciente } from './paciente';
import { PacienteService } from './paciente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pacientes',
    templateUrl: './paciente.component.html',
    styleUrls: ['./paciente.component.css']
})
export class PacientesComponent {

    pacientes: Paciente[];
    paginador: any;

    constructor(private pacienteService: PacienteService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            let page: number = +params.get('page');

            if (!page) {
                page = 0;
            }

            this.pacienteService.getPacientes(page).pipe(
                tap(response => {
                    console.log('PacienteService: tap 3');

                    (response.content as Paciente[]).forEach(paciente => {
                        console.log(paciente.nombre)
                    });
                })
            ).subscribe(response => {
                this.pacientes = response.content as Paciente[]
                this.paginador = response;
            });
        }
        );
    }

    delete(paciente: Paciente): void {
        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "¿Está seguro?",
            text: `¿Seguro de que desea eliminar al paciente ${paciente.nombre} ${paciente.apellido}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.pacienteService.delete(paciente.id)
                    .subscribe(response => {

                        this.pacientes = this.pacientes.filter(pac => pac !== paciente);

                        swalWithBootstrapButtons.fire({
                            title: "Paciente eliminado!",
                            text: `Paciente ${paciente.nombre} eliminado con éxito`,
                            icon: "success"
                        });
                    });
            }
        });
    }
}
