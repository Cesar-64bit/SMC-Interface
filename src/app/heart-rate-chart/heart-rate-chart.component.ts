import { Component, OnInit, OnDestroy } from '@angular/core';
import axios from 'axios';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-heart-rate-chart',
  templateUrl: './heart-rate-chart.component.html',
  styleUrls: ['./heart-rate-chart.component.css']
})
export class HeartRateChartComponent implements OnInit, OnDestroy {

  private chart: any;
  private ws: WebSocket;

  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
    this.initializeWebSocket();
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  private initializeChart(): void {
    const ctx = document.getElementById('heartRateChart') as HTMLCanvasElement;
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

  private async initializeWebSocket(): Promise<void> {
    const url = 'http://localhost:8080/api/signal-process';

    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);
      console.log(data.length);

      const labels = data.map(item => item.hora);
      const heartRates = data.map(item => item.senal);
      console.log(labels);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = heartRates;
      this.chart.update('none');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}