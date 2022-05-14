import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { FeaturedPlaylist, FeaturedPlaylistParent, Playlist } from './models/featured-playlist';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlaylistService {

  constructor(private httpClient: HttpClient
  ) { }

  getFeaturedPlaylists(country: string, limit: number, token: string): Observable<Playlist[]> {
    const requestOptions = {
      params: {
        country: country,
        limit: limit,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    return this.httpClient.get<FeaturedPlaylistParent>(`https://api.spotify.com/v1/browse/featured-playlists`, requestOptions).pipe(
      // only want to return the children
      map(data => data.playlists.items)
    );
  }
}
