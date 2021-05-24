import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of, OperatorFunction} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ServerServices} from '../../server.services';
import {SearchCard} from '../../shared/models/search-card.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  model: any;
  searching = false;
  searchFailed = false;

  constructor(private serverService: ServerServices, private router: Router) { }

  ngOnInit(): void {
  }

  search: OperatorFunction<string, readonly SearchCard[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.serverService.search(term)
      ),
      tap(() => this.searching = false)
    )

  navigateToResult(media: string, id: string): void{
    const navigateLink = `/watch/${media}/${id}`;
    this.router.navigate([navigateLink]).then(r => {});
  }
  formatter = (x: {title: string}) => '';

}
