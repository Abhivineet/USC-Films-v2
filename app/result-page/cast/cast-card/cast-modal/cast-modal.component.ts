import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ServerServices} from '../../../../server.services';
import {faTwitter, faFacebookSquare, faImdb, faInstagram} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-cast-modal',
  templateUrl: './cast-modal.component.html',
  styleUrls: ['./cast-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .popover-body{
      color: gray;
    }
    .my-custom-class .arrow::after {
      border-bottom-color: gray;
    }
  `]
})
export class CastModalComponent implements OnInit {
  @Input() id: string;
  @Input() imgLink: string;
  personDetails;
  facebookIcon = faFacebookSquare;
  twitterIcon = faTwitter;
  imdbIcon = faImdb;
  instaIcon = faInstagram;
  facebookLink: any;
  twitterLink: any;
  imdbLink: any;
  instaLink: any;

  constructor(public activeModal: NgbActiveModal, private serverServices: ServerServices) { }

  ngOnInit(): void {
    this.getThisGuy();
  }

  getThisGuy(): void{
    this.serverServices.getCastDetails(this.id).subscribe(response => {
      this.personDetails = response;
      this.facebookLink = response.facebook_link;
      this.imdbLink = response.imdb_link;
      this.twitterLink = response.twitter_link;
      this.instaLink = response.instagram_link;
    });
  }
}
