import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import * as _ from 'lodash';
import {ServerServices} from '../server.services';
import {LocalStorageServices} from '../local-storage.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fetchedHomeData = false;
  continueWatchingEmpty: boolean;
  condition: boolean;
  isHandset: boolean;
  data = {};
  sixChunkData = {};
  oneChunkData = {};
  continueWatchingData: any;
  showCW: boolean;
  categories = ['Popular Movies', 'Top Rated Movies', 'Trending Movies', 'Popular TV Shows', 'Top Rated TV Shows', 'Trending TV Shows'];

  constructor(
    private breakPointObserver: BreakpointObserver,
    private serverService: ServerServices,
    private localStorageService: LocalStorageServices
  ) {}

  ngOnInit(): void {
    this.breakPointObserver.observe(Breakpoints.Handset)
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches;
        if (!this.fetchedHomeData){
          this.getHomeData();
        }
        else{
          if (this.isHandset){
            this.data = this.oneChunkData;
          }
          else{
            this.data = this.sixChunkData;
          }
          // this.condition = this.localStorageService.getContinueWatching().length > 6;
          this.continueWatchingData = this.isHandset ? _.chunk(
            this.localStorageService.getContinueWatching(),
            1
          ) : _.chunk(
              this.localStorageService.getContinueWatching(),
            6
          );
        }
      });
  }

  getHomeData(): void{
    this.serverService.getHome().subscribe(response => {
      for (const cat of this.categories){
        // this.data[cat] = this.isHandset ? _.chunk(response[cat], 1) : _.chunk(response[cat], 6);
        this.oneChunkData[cat] = _.chunk(response[cat], 1);
        this.sixChunkData[cat] = _.chunk(response[cat], 6);
      }
      if (this.isHandset){
        this.data = this.oneChunkData;
      }
      else{
        this.data = this.sixChunkData;
      }
      if (!this.fetchedHomeData){
        this.fetchedHomeData = true;
      }
      this.continueWatchingEmpty = this.localStorageService.isContinueWatchingEmpty();
      this.condition = this.localStorageService.getContinueWatching().length > 6;
      this.continueWatchingData = this.isHandset ? _.chunk(
        this.localStorageService.getContinueWatching(),
        1
      ) : _.chunk(
        this.localStorageService.getContinueWatching(),
        6
      );
    });
  }

}
