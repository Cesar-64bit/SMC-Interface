import { Component } from '@angular/core';
import { Paciente } from '../pacientes/paciente';
import { PacienteService } from '../pacientes/paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservacionesService } from './observaciones.service';
import { Observaciones } from './observaciones';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public paciente: Paciente = new Paciente();
  public observaciones: Observaciones = new Observaciones();
  public errores: string[];

  showChart: boolean = false;

  toggleChart(): void {
    this.showChart = !this.showChart;
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

  public create(): void {
    // Asegúrate de que paciente sea un objeto completo
    this.observaciones.paciente = {
      id: this.paciente.id
      // Puedes agregar más campos si es necesario
    } as Paciente;

    console.log(this.observaciones.paciente);
    console.log(this.observaciones);

    this.observacionesService.create(this.observaciones).subscribe(
      observaciones => {
        this.router.navigate(['/info']);
        swal.fire('Comentario añadido con éxito!', 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
}