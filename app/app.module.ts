import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CurrentlyPlayingComponent } from './home/currently-playing/currently-playing.component';
import { SliderComponent } from './shared/components/slider/slider.component';
import { CardComponent } from './shared/components/slider/card-deck/card/card.component';
import { CardDeckComponent } from './shared/components/slider/card-deck/card-deck.component';
import { ResultPageComponent } from './result-page/result-page.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {VideoModule} from './result-page/video/video.module';
import { DetailsComponent } from './result-page/details/details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CastComponent } from './result-page/cast/cast.component';
import { CastCardComponent } from './result-page/cast/cast-card/cast-card.component';
import { ReviewsComponent } from './result-page/reviews/reviews.component';
import { ReviewCardComponent } from './result-page/reviews/review-card/review-card.component';
import { CastModalComponent } from './result-page/cast/cast-card/cast-modal/cast-modal.component';
import { MyListComponent } from './my-list/my-list.component';
import { SearchComponent } from './header/search/search.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CurrentlyPlayingComponent,
    SliderComponent,
    CardComponent,
    CardDeckComponent,
    ResultPageComponent,
    DetailsComponent,
    CastComponent,
    CastCardComponent,
    ReviewsComponent,
    ReviewCardComponent,
    CastModalComponent,
    MyListComponent,
    SearchComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    YouTubePlayerModule,
    VideoModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
