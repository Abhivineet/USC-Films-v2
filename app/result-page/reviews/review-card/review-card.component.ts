import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {
  @Input() data;
  isHandset: boolean;

  constructor(private breakPointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakPointObserver.observe(Breakpoints.Handset)
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches;
      });
  }

}
