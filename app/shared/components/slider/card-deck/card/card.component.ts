import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Card} from '../../../../models/card.model';
import {Breakpoints, BreakpointState, BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  showInfo = false;
  navigateLink: string;
  isHandset: boolean;

  constructor(private router: Router, private breakPointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakPointObserver.observe(Breakpoints.Handset)
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches;
        if (state.matches){
          this.showInfo = true;
        }
      });
  }

  mouseEnterCard(): void{
    this.showInfo = true;
  }

  mouseLeaveCard(): void{
    this.showInfo = false;
  }

  navigateToDetails(): void{
    this.navigateLink = `/watch/${this.card.media}/${this.card.id}`;
    this.router.navigate([this.navigateLink]);
  }
}
