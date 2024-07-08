import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-heart-rate-chart',
  templateUrl: './heart-rate-chart.component.html',
  styleUrls: ['./heart-rate-chart.component.css']
})
export class HeartRateChartComponent implements OnInit, OnDestroy {

  private chart: any;
  private timer: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
    this.startSimulation();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private initializeChart(): void {
    const ctx = document.getElementById('heartRateChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Ritmo Cardíaco',
          data: [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private startSimulation(): void {
    this.timer = setInterval(() => {
      const newHeartRate = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
      this.chart.data.labels.push(new Date().toLocaleTimeString());
      this.chart.data.datasets[0].data.push(newHeartRate);

      const maxDataPoints = 10;
      if (this.chart.data.labels.length > maxDataPoints) {
        this.chart.data.labels.shift();
        this.chart.data.datasets[0].data.shift();
      }

      this.chart.update();
    }, 2000);
  }
}
