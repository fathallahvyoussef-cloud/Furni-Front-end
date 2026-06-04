import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  template :  `
    <table>
      <thead>
        <tr>
          <th *ngFor="let col of columns">{{ col.header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data">
          <td     *ngFor="let col of columns">
            {{ row[col.field]  }}
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class Table {

  @Input() columns!: { field: string; header: string }[];
  @Input() data!: any[];
  
}
