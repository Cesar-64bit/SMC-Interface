import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
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

  constructor(
    private expedienteCardiacoService: ExpedienteCardiacoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      this.getExpedienteCardiaco();
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
      setTimeout(() => {
        console.log(this.expedienteCardiaco);

        const labels = this.expedienteCardiaco.map(item => item.hora);
        const heartRates = this.expedienteCardiaco.map(item => item.senal);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = heartRates;
        this.chart.update('none');
      }, 0);

    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}
