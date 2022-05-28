import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from "./dialog/dialog.component";
import {ApiService} from "./services/api.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'angular13Crud';
  displayedColumns: string[] = ['productName', 'price', 'comment', 'category', 'freshness', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,
  ) {

  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
      height: '100%'
    }).afterClosed().subscribe(val => {
      if (val==='Save') {
        this.getAllProduct();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllProduct() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert("error ....")
      }
    })
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      height: '100%',
      data: row,
    }).afterClosed().subscribe(val => {
      if (val==='Update') {
        this.getAllProduct();
      }
    })
  }

  deleteProducts(id:number) {
this.api.deleteProduct(id).subscribe({
  next:(re)=> {
    alert('product successfully deleted');
    this.getAllProduct();
  }
})

  }
}
