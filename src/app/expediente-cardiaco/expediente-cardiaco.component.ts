import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ExpedienteCardiaco } from './expediente-cardiaco';
import { ExpedienteCardiacoService } from './expediente-cardiaco.service';

@Component({
  selector: 'app-expediente-cardiaco',
  templateUrl: './expediente-cardiaco.component.html',
  styleUrls: ['./expediente-cardiaco.component.css']
})
export class ExpedienteCardiacoComponent implements OnInit {

  private chart: any;
  public expedienteCardiaco: ExpedienteCardiaco[] = [];
  public pacienteId: number;
  public alertMessages: { type: string, description: string }[] = [];
  public currentChunkIndex: number = 0;
  private chunkSize: number = 500;

  constructor(
    private expedienteCardiacoService: ExpedienteCardiacoService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      this.getExpedienteCardiaco();
      //this.getDataByMongo();
    });
  }

  ngAfterViewInit(): void {
    this.inicializarGrafico();
  }


  public getExpedienteCardiaco(): void {
    this.expedienteCardiacoService.getByPacienteId(this.pacienteId).subscribe(expedienteCardiaco => {
      this.expedienteCardiaco = expedienteCardiaco;
      this.graficarDatos();  // Llamada a graficarDatos() después de recibir los datos
    });
  }

  // public getDataByMongo(): void {
  //   this.expedienteCardiacoService.getAllData().subscribe(datosMongo => {
  //     this.expedienteCardiaco = datosMongo;
  //     this.graficarDatos();
  //   })
  // }

  private inicializarGrafico(): void {
    const ctx = document.getElementById('heartRateChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Señal cardíaca',
          data: [],
          tension: 0.9
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy'
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy'
            }
          }
        }
      }
    });
  }

  private graficarDatos(): void {
    try {
      const start = this.currentChunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.expedienteCardiaco.length);

      const chunk = this.expedienteCardiaco.slice(start, end);
      const labels = chunk.map(item => new Date().toLocaleTimeString());
      const heartRates = chunk.map(item => item.senal);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = heartRates;
      this.chart.update('none');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }

  public nextChunk(): void {
    if ((this.currentChunkIndex + 1) * this.chunkSize < this.expedienteCardiaco.length) {
      this.currentChunkIndex++;
      this.graficarDatos();
    }
  }

  public previousChunk(): void {
    if (this.currentChunkIndex > 0) {
      this.currentChunkIndex--;
      this.graficarDatos();
    }
  }

  procesarDatos(): void {
    const apiUrl = 'http://localhost:8081/api/signal-process';

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        const mensajesUnicos = new Set<string>();

        this.alertMessages = [];

        response.forEach((item: any) => {
          Object.entries(item).forEach(([key, value]: [string, any]) => {
            if (value !== "" && !mensajesUnicos.has(value)) {
              mensajesUnicos.add(value);
              this.alertMessages.push({ type: key, description: value });
            }
          });
        });

        if (this.alertMessages.length === 0) {
          this.alertMessages.push({ type: 'Información', description: 'No se detectaron irregularidades.' });
        }
      },
      error => {
        console.error('Error al procesar los datos', error);
        this.alertMessages = [{ type: 'Error', description: 'Error al procesar los datos' }];
      }
    );
  }
}