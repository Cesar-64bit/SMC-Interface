import { Component } from '@angular/core';
import { Paciente } from '../pacientes/paciente';
import { PacienteService } from '../pacientes/paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservacionesService } from './observaciones.service';
import { Observaciones } from './observaciones';
import swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public paciente: Paciente = new Paciente();
  public observaciones: Observaciones[] = [];  // Cambiar a array
  public nuevaObservacion: Observaciones = new Observaciones();  // Para agregar nuevas observaciones
  public errores: string[];

  showChart: boolean = false;
  showSaveButton: boolean = false;

  toggleChart(): void {
    this.showChart = !this.showChart;
    this.showSaveButton = this.showChart;
  }

  constructor(
    private pacienteService: PacienteService,
    private observacionesService: ObservacionesService,
    private router: Router,
    private activateRoute: ActivatedRoute) {
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

  public getObservaciones(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.observacionesService.getByPacienteId(id).subscribe(observaciones => {
          this.observaciones = observaciones;
          console.log(observaciones);
          this.showHistorialModal();
        });
      }
    });
  }

  public create(): void {
    this.nuevaObservacion.paciente = {
      id: this.paciente.id
    } as Paciente;

    console.log(this.nuevaObservacion.paciente);
    console.log(this.nuevaObservacion);

    this.observacionesService.create(this.nuevaObservacion).subscribe(
      observaciones => {
        swal.fire('Comentario añadido con éxito!', '', 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  private showHistorialModal(): void {
    const modalElement = document.getElementById('historialModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
