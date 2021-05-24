import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.css']
})
export class CastComponent implements OnInit {
  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}
