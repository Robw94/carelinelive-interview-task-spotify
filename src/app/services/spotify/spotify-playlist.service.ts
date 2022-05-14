import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bufferCount, from, map, mergeMap, of, reduce, switchMap } from 'rxjs';
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
      map(data => data.playlists.items),
      switchMap(data => data),
      mergeMap(value => {
        const options = {
          params: {
            fields: 'followers,external_urls,id',
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        };
        return this.httpClient.get<Details>(`https://api.spotify.com/v1/playlists/${value.id}`, options).pipe(map(details => createPlayList(value, details)))

      }),
      reduce((acc: Playlist[], playlist: Playlist) => acc.concat(playlist), []),

    );
  }
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href?: any;
  total: number;
}

export interface Details {
  external_urls: ExternalUrls;
  followers: Followers;
  id: string;
}

export function createPlayList(playlist: Playlist, details: Details): Playlist {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    images: playlist.images,
    tracks: {
      total: playlist.tracks.total,
      href: playlist.tracks.href,
    },
    details: details,
    href: playlist.href,
    type: playlist.type,
    uri: playlist.uri
  };
}