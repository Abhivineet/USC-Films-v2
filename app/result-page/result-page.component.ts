import { Component, OnInit } from '@angular/core';
import {ServerServices} from '../server.services';
import {ActivatedRoute, Router} from '@angular/router';
import {faTwitter, faFacebookSquare} from '@fortawesome/free-brands-svg-icons';
import {LocalStorageServices} from '../local-storage.services';
import {Card} from '../shared/models/card.model';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import * as _ from 'lodash';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent implements OnInit {

  dataFetched = false;
  isHandset: boolean;
  media: string;
  id: string;
  data;
  twitter = faTwitter;
  facebook = faFacebookSquare;
  twitterLink: string;
  facebookLink: string;
  localStorageHelperData;
  sixChunkRecoMedia: Array<Card[]>;
  similarMedia: Array<Card[]>;
  recommendedMedia: Array<Card[]>;
  oneChunkSimilarMedia: Array<Card[]>;
  oneChunkRecoMedia: Array<Card[]>;
  sixChunkSimilarMedia: Array<Card[]>;
  isRecommendedEmpty = true;
  isSimilarEmpty = true;


  constructor(
    private serverServices: ServerServices,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageServices,
    private breakPointObserver: BreakpointObserver,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.media = this.route.snapshot.params.media;
    this.id = this.route.snapshot.params.id;
    this.breakPointObserver.observe(Breakpoints.Handset)
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches;
        if (!this.dataFetched){
          this.getData();
        }
        else{
          console.log(this.recommendedMedia);
          if (this.isHandset){
            this.similarMedia = this.oneChunkSimilarMedia;
            this.recommendedMedia = this.oneChunkRecoMedia;
          }
          else{
            this.similarMedia = this.sixChunkSimilarMedia;
            this.recommendedMedia = this.sixChunkRecoMedia;
          }
        }
      });
  }

  getData(): void{
    this.serverServices.getResults(this.media, this.id).subscribe(response => {
      this.data = response;

      this.twitterLink = this.data.twitter;
      this.facebookLink = this.data.facebook;
      if (this.data.similar.length>0){
        this.isSimilarEmpty = false;
      }
      if (this.data.recommended.length>0){
        this.isRecommendedEmpty = false;
      }

      this.oneChunkSimilarMedia = _.chunk(this.data.similar, 1);
      this.sixChunkSimilarMedia = _.chunk(this.data.similar, 6);

      this.oneChunkRecoMedia = _.chunk(this.data.recommended, 1);
      this.sixChunkRecoMedia = _.chunk(this.data.recommended, 6);

      if (this.isHandset){
        this.similarMedia = this.oneChunkSimilarMedia;
        this.recommendedMedia = this.oneChunkRecoMedia;
      }
      else{
        this.similarMedia = this.sixChunkSimilarMedia;
        this.recommendedMedia = this.sixChunkRecoMedia;
      }
      this.dataFetched = true;

      this.addToContinueWatching();
    });
  }

  addToContinueWatching(): void{
    this.localStorageHelperData = new Card(this.data.details.title, this.id, this.data.posterPath, this.data.media);
    this.localStorageService.putContinueWatching(this.id, this.localStorageHelperData);
  }
}
