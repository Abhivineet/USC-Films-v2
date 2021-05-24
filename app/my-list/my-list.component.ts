import { Component, OnInit } from '@angular/core';
import {LocalStorageServices} from '../local-storage.services';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
  isEmpty;
  myListDecks;

  constructor(private localStorageService: LocalStorageServices) { }

  ngOnInit(): void {
    this.isEmpty = this.localStorageService.isMyListEmpty();
    if (!this.isEmpty){
      this.myListDecks = this.localStorageService.getMyList();
    }
  }

}
