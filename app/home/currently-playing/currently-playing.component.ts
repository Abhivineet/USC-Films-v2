import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {ServerServices} from '../../server.services';
import {Router} from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

@Component({
  selector: 'app-currently-playing',
  templateUrl: './currently-playing.component.html',
  styleUrls: ['./currently-playing.component.css'],
  // providers: [NgbCarouselConfig]
})
export class CurrentlyPlayingComponent implements OnInit {
  fetchedCarousel = false;
  infoVisible = false;
  cpmcCarouselData;
  isHandset: boolean;
  // config: NgbCarouselConfig,
  constructor(private breakpointObserver: BreakpointObserver, private serverService: ServerServices, private router: Router) {
    this.getCpmc();

    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((state: BreakpointState) => {
      this.isHandset = state.matches;
    });

    // config.interval = 5000;
    // config.wrap = false;
    // config.keyboard = false;
    // config.pauseOnHover = true;
  }

  ngOnInit(): void {
  }

  getCpmc(): void{
    this.serverService.getCpmcCarousel().subscribe(response => {
      // console.log(response.output);
      this.cpmcCarouselData = response.output;
      this.fetchedCarousel = true;
    });
  }

  onMouseEnter(): void{
    this.infoVisible = true;
  }

  onMouseLeave(): void{
    this.infoVisible = false;
  }

  navigateToDetails(id: string): void{
    const navigateLink = '/watch/movie/' + id;
    this.router.navigate([navigateLink]).then(r => {});
  }

}
