import { Component } from '@angular/core';
import { switchMap } from 'rxjs';
import { SpotifyApiService } from './services/spotify/spotify-api.service';
import { SpotifyTokenService } from './services/spotify/spotify-token.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private tokenService: SpotifyTokenService,
    ) {

        this.tokenService.getToken().subscribe();
    }
}
