import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageServices} from '../../local-storage.services';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() data;
  inWatchList: boolean;
  @Input() watchListData;
  @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
  @ViewChild('dangerAlert', {static: false}) dangerAlert: NgbAlert;
  firstOpen: boolean;
  showSuccess: boolean;
  showDanger: boolean;

  constructor(private localStorageService: LocalStorageServices) { }

  ngOnInit(): void {
    this.showSuccess = false;
    this.showDanger = false;
    this.inWatchList = this.localStorageService.isInMyList(this.watchListData.id);
  }

  toggleWatchListStatus(): void{
    if (!this.inWatchList){
      this.showDanger = false;
      this.localStorageService.putInMyList(this.watchListData.id, this.watchListData);
      this.inWatchList = this.localStorageService.isInMyList(this.watchListData.id);
      this.showSuccess = true;
      setTimeout(() => {
        this.successAlert.close();
        this.showSuccess = false;
      }, 5000);
    }
    else{
      this.showSuccess = false;
      this.localStorageService.removeFromMyList(this.watchListData.id);
      this.inWatchList = this.localStorageService.isInMyList(this.watchListData.id);
      this.showDanger = true;
      setTimeout(() => {
        this.dangerAlert.close();
        this.showDanger = false;
      }, 5000);
    }
  }
}
