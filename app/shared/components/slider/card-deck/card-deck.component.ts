import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../../../models/card.model';

@Component({
  selector: 'app-card-deck',
  templateUrl: './card-deck.component.html',
  styleUrls: ['./card-deck.component.css']
})
export class CardDeckComponent implements OnInit {
  @Input() cardData: Card[];
  @Input() slideNumber: number;

  constructor() { }

  ngOnInit(): void {
  }


}
