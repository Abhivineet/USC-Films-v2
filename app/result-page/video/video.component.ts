import {Component, Input, OnInit} from '@angular/core';

@Component({
  templateUrl: './video.component.html',
  selector: 'app-video',
})
export class VideoComponent implements OnInit {

  @Input() data;

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
