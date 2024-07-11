import { Component } from '@angular/core';
import { Paciente } from '../pacientes/paciente';
import { PacienteService } from '../pacientes/paciente.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public paciente: Paciente = new Paciente();

  showChart: boolean = false;

  toggleChart(): void {
    this.showChart = !this.showChart;
  }

  constructor(private pacienteService: PacienteService, private activateRoute: ActivatedRoute) {
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

  nuevaObservacion = '';
  observaciones = [
    { texto: 'Paciente se queja de dolor en el pecho', fecha: new Date() },
    { texto: 'Recomendar más ejercicio físico', fecha: new Date() }
  ];

  agregarObservacion() {
    if (this.nuevaObservacion.trim() !== '') {
      this.observaciones.push({
        texto: this.nuevaObservacion,
        fecha: new Date()
      });
      this.nuevaObservacion = '';
    }
  }

}
