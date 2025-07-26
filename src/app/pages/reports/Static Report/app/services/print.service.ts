import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  /**
   * Print employee report
   * This method creates a print optimized version of the employee report
   */
  printEmployeeReport(employees: any): void {
    console.log(employees);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 5px;
          }
          .report-date {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 0.9rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <h1>Employee Report</h1>
        <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>

        <table>
          <thead>
            <tr>
              <th>Employee No</th>
              <th>Full Name</th>
              <th>Birthday</th>
              <th>Phone No</th>
              <th>Email</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map((emp: any) => `
              <tr>
                <td>${emp.employeeNumber}</td>
                <td>${emp.fullName} </td>
                <td>${this.formatDate(emp.birthday)}</td>
                <td>${emp.contactNumber}</td>
                <td>${emp.email}</td>
                <td>${emp.gender}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential - For internal use only</p>
          <p>Total Employees: ${employees.length}</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write content to iframe and print
    iframe.contentWindow?.document.write(printContent);
    iframe.contentWindow?.document.close();

    // Wait for content to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }


  printItemReport(items: any): void {
    console.log(items);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Item list Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 5px;
          }
          .report-date {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 0.9rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <h1>Stock Item Report</h1>
        <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>

        <table>
          <thead>
            <tr>
              <th>Item No.</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Added date</th>
              <th>Expiry date</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((itm: any) => `
              <tr>
                <td>${itm.itemId}</td>
                <td>${itm.itemName} </td>
                <td>${itm.qty}</td>
                <td>${itm.category}</td>
                <td>${this.formatDate(itm.addedDate)}</td>
                <td>${this.formatDate(itm.expDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential - For internal use only</p>
          <p>Total Items: ${items.length}</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write content to iframe and print
    iframe.contentWindow?.document.write(printContent);
    iframe.contentWindow?.document.close();

    // Wait for content to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }




  printSupplierReport(suppliers: any): void {
    console.log(suppliers);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Supplier Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 5px;
          }
          .report-date {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 0.9rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <h1>Supplier Report</h1>
        <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>

        <table>
          <thead>
            <tr>
              <th>Supplier Id</th>
              <th>Supplier Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers.map((sup: any) => `
              <tr>
                <td>${sup.supplierID}</td>
                <td>${sup.supplierName} </td>
                <td>${sup.contactNumber}</td>
                <td>${sup.supplierEmailAddress}</td>
                <td>${sup.address}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential - For internal use only</p>
          <p>Total Suppliers: ${suppliers.length}</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write content to iframe and print
    iframe.contentWindow?.document.write(printContent);
    iframe.contentWindow?.document.close();

    // Wait for content to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }




  public formatDate(date: any) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  };
}
