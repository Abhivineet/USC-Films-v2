import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import {ServerServices} from '../../../server.services';
import {Breakpoints, BreakpointState, BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @Input() deckData;
  @Input() showPageIndicators: boolean;
  @Input() showArrows: boolean;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = false;
  pauseOnFocus = false;
  isHandset: boolean;

  constructor(private serverService: ServerServices, private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.togglePaused();
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((state: BreakpointState) => {
      this.isHandset = state.matches;
    });
  }

  togglePaused(): void {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent): void {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}
