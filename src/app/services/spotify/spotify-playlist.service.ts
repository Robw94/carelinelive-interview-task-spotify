import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bufferCount, concatMap, EMPTY, from, map, mergeMap, of, reduce, switchMap, take, toArray } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { FeaturedPlaylist, FeaturedPlaylistParent, Playlist } from './models/featured-playlist';
import { Track } from './models/spotify-playlist';

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
      // only want to return the playlists
      map(data => data.playlists.items),
      // map the playlists
      switchMap(playlists => playlists),
      // iterate through each playlist calling /playlists endpoint
      // get the details specified in the params
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
      // return array
      reduce((acc: Playlist[], playlist: Playlist) => acc.concat(playlist), []),

    );
  }


  // getTopXPopularTracks(ids: string, amount: number, token: string): Observable<Track[]> {
  //   const requestOptions = {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     params: {
  //       ids: ids,
  //     },
  //   }
  //   return this.httpClient.get<Track[]>('https://api.spotify.com/v1/tracks', requestOptions).pipe(
  //     map(tracks => {
  //       tracks.sort(t => t.popularity);
        
  //       return tracks
  //     }),

  //   );
  // }

  /**
   *  Spams endpoint too much.
   * @param ids 
   * @param amount 
   * @param token 
   * @returns 
   */

  getTopXPopularTracksOld(ids: string[], amount: number, token: string): Observable<Track[]> {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }

    return from(ids).pipe(
      concatMap((n) =>
        this.httpClient.get<Track>(`https://api.spotify.com/v1/tracks/${n}`, requestOptions).pipe(
        )),
      toArray(),
      map(e => e.sort(e => e.popularity)),
      // filthy way to do it, other approach was to take(x) and build up an array, but need all values to sort
      // by popularity
      map(a => a.slice(0, amount))
      // take(5),
    )


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