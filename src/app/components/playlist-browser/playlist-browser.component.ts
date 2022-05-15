import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, debounceTime, EMPTY, finalize, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SimplePlaylist } from 'src/app/services/spotify/models/simple-playlist';
import { PlaylistSearchResult, SpotifyApiService } from 'src/app/services/spotify/spotify-api.service';
import { SpotifyPlaylistService } from 'src/app/services/spotify/spotify-playlist.service';
import { SpotifyTokenService } from 'src/app/services/spotify/spotify-token.service';

@Component({
  selector: 'app-playlist-browser',
  templateUrl: './playlist-browser.component.html',
  styleUrls: ['./playlist-browser.component.scss']
})
export class PlaylistBrowserComponent implements OnInit {

  filterForm = new FormGroup({
    searchText: new FormControl({ value: null, disabled: false }, Validators.minLength(1))
  })

  private onDestroy$ = new Subject<void>();

  private token!: string;

  search$!: Observable<PlaylistSearchResult[]>

  playlist!: SimplePlaylist

  test$!: Observable<any>;
  constructor(private service: SpotifyApiService, private spotifyTokenService: SpotifyTokenService, private test: SpotifyPlaylistService) {
    this.spotifyTokenService.token$.pipe(takeUntil(this.onDestroy$)).subscribe(tokenResult => {
      if (!tokenResult) {
        return;
      }

      this.token = tokenResult.access_token;
    })
  }

  ngOnInit(): void {
    this.filterForm.controls["searchText"].valueChanges.pipe(
      // added debounce time to not spam the endpoint
      debounceTime(500),
      // kill subscription when page closes.
      takeUntil(this.onDestroy$)).subscribe(text => {
        this.getPlaylists(text);
      })

  }


  getPlaylists(searchText: string): void {
    this.search$ = this.service.searchPlaylists(searchText, 5, this.token).pipe(debounceTime(100));
  }

  playlistSelected(id: string): void {
    // set search to empty to close the suggestions
    this.search$ = EMPTY;
    const sub = this.service.playlist(id, this.token).pipe(finalize(() => {
      sub.unsubscribe();
    })).subscribe(result => {
      this.playlist = result;
    })
  }

}
