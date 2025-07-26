import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-monthly-sales',
  standalone: false,
  templateUrl: './monthly-sales.component.html',
  styleUrl: './monthly-sales.component.scss',
})
export class MonthlySalesComponent {
  @ViewChild('chart') chart!: ChartComponent;
  monthlySalesChartOptions: any = {};

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {
    this.getMonthlySalesData();
  }

  public getMonthlySalesData(): void {
    this.commonDataService.getMonthlySalesData().subscribe({
      next: (response: any) => {
        this.updateMonthlySalesChart(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      },
    });
  }

  public updateMonthlySalesChart(dataList: any) {
    const monthlySalesData = dataList.map((data: any) => {
      return {
        x: data.orderMonth,
        y: data.cnt,
      };
    });

    this.monthlySalesChartOptions = {
      series: [{ name: 'Number of Sales per Month', data: monthlySalesData }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: '#6b7280',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Count',
          style: {
            color: '#6b7280',
          },
        },
        labels: {
          style: {
            colors: '#6b7280',
          },
        },
      },
      colors: ['#f97316'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%',
        },
      },
      grid: {
        borderColor: '#e5e7eb',
      },
      title: {
        text: 'Numbe of Sales per Month',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px',
        },
      },
    };
  }
}
