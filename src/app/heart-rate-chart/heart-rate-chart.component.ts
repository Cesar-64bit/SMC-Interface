import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Paciente } from '../pacientes/paciente';
import { ExpedienteCardiaco } from '../expediente-cardiaco/expediente-cardiaco';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-heart-rate-chart',
  templateUrl: './heart-rate-chart.component.html',
  styleUrls: ['./heart-rate-chart.component.css']
})
export class HeartRateChartComponent implements OnInit, OnDestroy {

  private chart: any;
  private ws: WebSocket;
  public paciente: Paciente = new Paciente();
  public agregarExpedienteCardiaco: ExpedienteCardiaco = new ExpedienteCardiaco();
  private heartRateData: any[] = [];  // Para almacenar los datos de la señal y hora
  private cont: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.paciente.id = +params.get('id')!;
      this.initializeChart();
      this.initializeWebSocket();
    });
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  private initializeChart(): void {
    const ctx = document.getElementById('heartRateChart') as HTMLCanvasElement;

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

  // private initializeWebSocket(): void {
  //   const url = 'ws://192.168.1.17:8080/ws';

  //   this.ws = new WebSocket(url);

  //   this.ws.onmessage = (event) => {
  //     if (this.ws) { // Verifica si el WebSocket está activo
  //       try {
  //         const data = JSON.parse(event.data);

  //         if (data && data.senal !== undefined) {
  //           const newHeartRate = data.senal;

  //           // Añadir nueva lectura a la gráfica
  //           this.chart.data.labels.push(new Date().toLocaleTimeString());
  //           this.chart.data.datasets[0].data.push(newHeartRate);

  //           const maxDataPoints = 500;
  //           if (this.chart.data.labels.length > maxDataPoints) {
  //             this.chart.data.labels.shift();
  //             this.chart.data.datasets[0].data.shift();
  //           }

  //           this.chart.update('none');
  //         }
  //       } catch (error) {
  //         console.error("Error procesando el mensaje WebSocket:", error);
  //       }
  //     }
  //   };

  //   this.ws.onclose = () => {
  //     console.log("WebSocket connection closed.");
  //     this.ws = null; // Asegúrate de que ws esté en null para evitar actualizaciones posteriores.
  //   };

  //   this.ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };
  // }

  private async initializeWebSocket(): Promise<void> {
    const url = 'http://192.168.1.17:8080/api/all-data';

    try {
      const response = await axios.get(url);
      const data = response.data;

      console.log(data);
      console.log(data.length);

      this.heartRateData = data;

      this.updateChartPeriodically();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private updateChartPeriodically(): void {
    if (this.heartRateData && this.heartRateData.length > 0) {
      let index = 0;

      setInterval(() => {
        if (index < this.heartRateData.length) {
          const item = this.heartRateData[index];
          this.chart.data.labels.push(new Date().toLocaleTimeString());
          this.chart.data.datasets[0].data.push(item.senal);
          console.log('Datos:' + index);

          const maxDataPoints = 200;
          if (this.chart.data.labels.length > maxDataPoints) {
            this.chart.data.labels.shift();
            this.chart.data.datasets[0].data.shift();
          }

          this.chart.update('none');
          index++;
        }
      }, 1);
    } else {
      console.error('No hay datos para graficar.');
    }
  }


  public async guardarDatos(): Promise<void> {
    for (const item of this.heartRateData) {
      await this.saveData(item.senal, item.hora, this.paciente.id);
    }
    console.log('Todos los datos han sido guardados.');
  }

  private async saveData(senal: string, hora: string, pacienteId: number): Promise<void> {
    try {
      const response = await axios.post('http://localhost:8080/api/info-cardiaca', { senal, hora, paciente: { id: pacienteId } });
      console.log('Datos almacenados', response.data);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

}
