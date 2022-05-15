import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaylistAnalysisComponent } from './components/playlist-analysis/playlist-analysis.component';
import { TrackCardComponent } from './components/track-card/track-card.component';
import { PlaylistBrowserComponent } from './components/playlist-browser/playlist-browser.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaylistInfoComponent } from './components/playlist-browser/playlist-info/playlist-info.component';
import { FeaturedPlaylistsComponent } from './components/featured-playlists/featured-playlists.component';
import { FeaturedPlaylistCardComponent } from './components/featured-playlists/featured-playlist-card/featured-playlist-card.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
        AppComponent,
        TrackCardComponent,
        PlaylistAnalysisComponent,
        PlaylistBrowserComponent,
        PlaylistInfoComponent,
        FeaturedPlaylistsComponent,
        FeaturedPlaylistCardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        HttpClientModule,
        MatCardModule, 
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
