import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SpotifyPlaylistService } from 'src/app/services/spotify/spotify-playlist.service';
import { SpotifyTokenService } from 'src/app/services/spotify/spotify-token.service';
import { SimplePlaylist } from '../../services/spotify/models/simple-playlist';

@Component({
    selector: 'app-playlist-analysis',
    templateUrl: './playlist-analysis.component.html',
    styleUrls: ['./playlist-analysis.component.scss']
})
export class PlaylistAnalysisComponent implements OnInit, OnDestroy, OnChanges {
    private _playlist!: SimplePlaylist;

    @Input() set playlist(value: SimplePlaylist) {
        this._playlist = value;
    }

    get playlist(): SimplePlaylist {
        return this._playlist;
    }

    token!: string;
    private onDestroy$ = new Subject<void>();


    popularTracks: any[] = []
    isLoading = false;
    constructor(private playlistService: SpotifyPlaylistService, private tokensService: SpotifyTokenService) {
        this.tokensService.token$.pipe(takeUntil(this.onDestroy$)).subscribe(tokenResult => {
            if (!tokenResult) {
                return;
            }

            this.token = tokenResult.access_token;
        })

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this._playlist) {
            this.popularTracks = [];
            this.isLoading = true;
            this.playlistService.getTopXPopularTracksOld(this.playlist.tracks.items.map(i => i.id), 10, this.token).pipe(
                // wait for call to finish before displaying items
                finalize(() => {
                    this.isLoading = false;
                })).subscribe(res => {
                    res.forEach(i => this.popularTracks.push({ name: i.name.toString(), value: i.popularity }));
                })
        }
    }
    ngOnDestroy(): void {
        // destroy active subs
        this.onDestroy$.next();
    }

    ngOnInit(): void {

    }
}
