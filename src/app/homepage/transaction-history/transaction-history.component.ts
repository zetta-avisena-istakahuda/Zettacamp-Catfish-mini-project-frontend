import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  private subsUser = new SubSink();
  private subsTransaction = new SubSink();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  page = 1;
  max_page: number = 1
  allUserName = new FormControl();
  dateStart = new FormControl();
  dateEnd = new FormControl();
  clockStart = new FormControl("00:01");
  clockEnd = new FormControl("23:55");
  dataTable: any = []
  dataUser!: any
  dataSource = new MatTableDataSource(this.dataTable)
  displayedColumns: string[] = ['order_time', 'name', 'item_name', 'amount'];
  constructor(private service: ApiServiceService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.subsUser.sink = this.service.getAllUsers().valueChanges.subscribe((resp: any) => {
      this.dataUser = resp.data.getAllUsers.data;

    })

    this.subsTransaction.sink = this.service.getAllTransactions('success', false, 
    this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      this.dataSource = new MatTableDataSource(this.dataTable)
      this.max_page = resp.data.getAllTransactions.max_page;
    })

    this.allUserName.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.dateStart.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.dateEnd.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.clockStart.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.clockEnd.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    
  }

  onFilter() {
    this.page = 1
    this.subsTransaction.sink = this.service.getAllTransactions('success', false, 
    this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      this.dataSource = new MatTableDataSource(this.dataTable)
      this.max_page = resp.data.getAllTransactions.max_page;
    })
    this.service.getAllTransactions('success', false, 
    this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).refetch()
  }

  previousPage() {
    if (this.page > 1) {
      this.page--
      this.subsTransaction.sink = this.service.getAllTransactions('success', false, 
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.dataSource = new MatTableDataSource(this.dataTable)
      })
      this.service.getAllTransactions('success', false, 
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).refetch()    }
  }

  nextPage() {
    if (this.page < this.max_page) {
      this.page++
      this.subsTransaction.sink = this.service.getAllTransactions('success', false, 
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.dataSource = new MatTableDataSource(this.dataTable)
      })
      this.service.getAllTransactions('success', false, 
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value)).refetch()    }
  }

  dateStartProcess(val: string){
      if(val){
        return(this.datePipe.transform(val, 'yyyy-MM-dd')+"T"+this.clockStart.value+":00+07:00");        
      }  
      else{
        return ""
      }   
  }

  dateEndProcess(val: string){
    if(val){
      return(this.datePipe.transform(val, 'yyyy-MM-dd')+"T"+this.clockEnd.value+":00+07:00");        
    }  
    else{
      return ""
    }   
}

}
