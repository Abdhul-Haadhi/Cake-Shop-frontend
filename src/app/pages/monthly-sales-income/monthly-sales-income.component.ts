import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-monthly-sales-income',
  standalone: false,
  templateUrl: './monthly-sales-income.component.html',
  styleUrl: './monthly-sales-income.component.scss',
})
export class MonthlySalesIncomeComponent {
  @ViewChild('chart') chart!: ChartComponent;
  monthlySalesIncomeChartOptions: any = {};

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {
    this.getMonthlySalesIncome();
  }
  public getMonthlySalesIncome(): void {
    this.commonDataService.getMonthlySalesIncome().subscribe({
      next: (response: any) => {
        this.updateMonthlySalesIncomeChart(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      },
    });
  }

  public updateMonthlySalesIncomeChart(dataList: any) {
    const monthlySalesIncomeData = dataList.map((data: any) => {
      return {
        x: data.orderMonth,
        y: data.summation,
      };
    });

    this.monthlySalesIncomeChartOptions = {
      series: [
        { name: 'Sales income per Month', data: monthlySalesIncomeData },
      ],
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
      colors: ['#076866ff'],
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
        text: 'Sales income per Month',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px',
        },
      },
    };
  }
}
