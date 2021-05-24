import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CastModalComponent} from './cast-modal/cast-modal.component';

@Component({
  selector: 'app-cast-card',
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.css']
})
export class CastCardComponent implements OnInit {
  @Input() data;
  showCard: boolean;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.showCard = this.data.profile_path !== null;
  }

  openCastModal(): void{
    const modalReference = this.modalService.open(CastModalComponent, {size: 'lg'});
    modalReference.componentInstance.id = this.data.id;
    modalReference.componentInstance.imgLink = this.data.profile_path;
  }
}
