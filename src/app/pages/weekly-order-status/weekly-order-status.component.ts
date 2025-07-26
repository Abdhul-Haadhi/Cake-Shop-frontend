import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-weekly-order-status',
  standalone: false,
  templateUrl: './weekly-order-status.component.html',
  styleUrl: './weekly-order-status.component.scss',
})
export class WeeklyOrderStatusComponent {
  @ViewChild('chart') chart!: ChartComponent;
  weeklyOrdersbyStatus: any = {};

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {
    this.getNoOfOrdersPlaceThisWeekByStatus();
  }

  public getNoOfOrdersPlaceThisWeekByStatus(): void {
    this.commonDataService.getNoOfOrdersPlaceThisWeekByStatus().subscribe({
      next: (response: any) => {
        this.updateWeeklyOrdersByStatus(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      },
    });
  }

  public updateWeeklyOrdersByStatus(dataSet: any): void {
    const data = dataSet.map((item: any) => item.cnt);
    const labels = dataSet.map((item: any) => item.status);

    this.weeklyOrdersbyStatus = {
      series: data,
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      labels: labels,
      colors: [
        '#3b82f6',
        '#10b981',
        '#f97316',
        '#8b5cf6',
        '#ef4444',
        '#06b6d4',
      ],
      legend: {
        position: 'bottom',
        labels: {
          colors: '#6b7280',
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
          },
        },
      },
      title: {
        text: 'Weekly orders by status',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px',
        },
      },
    };
  }
}
