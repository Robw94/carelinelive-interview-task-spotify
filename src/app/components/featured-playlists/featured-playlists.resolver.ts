import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { combineLatest, Observable, switchMap } from "rxjs";
import { map } from 'rxjs/operators'
import { FeaturedPlaylist, FeaturedPlaylistParent, Playlist } from "src/app/services/spotify/models/featured-playlist";
import { SpotifyPlaylistService } from "src/app/services/spotify/spotify-playlist.service";
import { SpotifyTokenService } from "src/app/services/spotify/spotify-token.service";

export interface IFeaturedPlaylistsStaticData {
    featuredPlaylists: Playlist[];
}

@Injectable({ providedIn: 'root' })
export class FeaturedPlaylistsResolver implements Resolve<IFeaturedPlaylistsStaticData> {

    /**
     *
     */
    constructor(private tokenService: SpotifyTokenService, private playListService: SpotifyPlaylistService, private httpClient: HttpClient) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFeaturedPlaylistsStaticData> | Promise<IFeaturedPlaylistsStaticData> | any {

        return combineLatest([
            this.tokenService.getToken().pipe(switchMap(token => this.playListService.getFeaturedPlaylists('GB', 10, token)))
        ]).pipe(
            map(
                ([
                    featuredPlaylists
                ]: [
                    Playlist[]
                    ]) => ({
                        featuredPlaylists: featuredPlaylists
                    }),
                (err: any) => {
                    throw err;
                }
            )
        );
    }
}