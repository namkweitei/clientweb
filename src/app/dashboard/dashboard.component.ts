import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LoginsvService } from '../services/loginsv.service';
import { Chart, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  contributionsByFaculty: any[] = [];
  @ViewChild('pieChartCanvas') private pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  private pieChartContext!: CanvasRenderingContext2D;

  constructor(private loginsvService: LoginsvService) { }

  ngOnInit(): void {
    this.getDashboardContributionsByFaculty();
  }

  ngAfterViewInit(): void {
    if (this.pieChartCanvas && this.pieChartCanvas.nativeElement) {
      const canvasElement: HTMLCanvasElement = this.pieChartCanvas.nativeElement;
      this.pieChartContext = canvasElement.getContext('2d')!;
    }
  }

  getDashboardContributionsByFaculty(): void {
    this.loginsvService.getDashboardContributionsByFaculty().subscribe(
      data => {
        this.contributionsByFaculty = data;
        console.log(this.contributionsByFaculty);
        this.renderPieChart();
      },
      error => {
        console.error('Error retrieving contributions by faculty:', error);
      }
    );
  }

  renderPieChart(): void {
    if (!this.contributionsByFaculty.length) return;
    const labels = this.contributionsByFaculty.map(item => item.facultyName);
    const data = this.contributionsByFaculty.map(item => item.numberOfContributions);

    // // Define plugin options
    // const pluginOptions = {
    //   datalabels: {
    //     formatter: (value: any, ctx: any) => {
    //       const label = ctx.chart.data.labels[ctx.dataIndex];
    //       return label + '\n' + value;
    //     }
    //   }
    // };

    // Pass plugin options to the chart configuration
    new Chart(this.pieChartContext, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ]
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1,
      }
    });
  }
}
