import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CLIENT_ID, CLIENT_SECRET } from 'src/environments/credentials';

interface SpotifyTokenResponseBody {
  access_token: string;
  token_type: string;
  expires_in: number;
}
@Injectable({
  providedIn: 'root'
})
export class SpotifyTokenService {
  private _tokenSubject: BehaviorSubject<SpotifyTokenResponseBody> = new BehaviorSubject<SpotifyTokenResponseBody>({
    access_token: '',
    token_type: '',
    expires_in: 0,
  });


  // idea was to make a dashboard for overall stats and use this to use the same token.
  token$ = this._tokenSubject.asObservable();

  constructor(private http: HttpClient
  ) { }

  getToken(): Observable<string> {
    const body = new HttpParams({
      fromObject: {
        grant_type: 'client_credentials',
      }
    });

    return this.http.post<SpotifyTokenResponseBody>('https://accounts.spotify.com/api/token', body.toString(), {
      headers: {
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).pipe(
      tap(response => this._tokenSubject.next(response)),
      map(response => response.access_token)

    );
  }
}
