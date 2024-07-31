import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservacionesService } from '../home/observaciones.service';
import { Observaciones } from '../home/observaciones';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.css']
})
export class ObservacionesComponent implements OnInit {
  public observaciones: Observaciones[] = [];
  public pacienteId: number;
  public page: number = 1;
  public pageSize: number = 4;

  constructor(
    private observacionesService: ObservacionesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      this.getObservaciones();
    });
  }

  public getObservaciones(): void {
    this.observacionesService.getByPacienteId(this.pacienteId).subscribe(observaciones => {
      this.observaciones = observaciones;
    });
  }
}
