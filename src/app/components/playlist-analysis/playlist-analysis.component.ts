import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest, finalize, Subject, takeUntil } from 'rxjs';
import { Track } from 'src/app/services/spotify/models/spotify-playlist';
import { SpotifyPlaylistService } from 'src/app/services/spotify/spotify-playlist.service';
import { SpotifyTokenService } from 'src/app/services/spotify/spotify-token.service';
import { SimplePlaylist, SimpleTrack } from '../../services/spotify/models/simple-playlist';

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
    slowestTracks: any[] = [];
    fastestTracks: any[] = [];
    artistData: any[] = [];
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
            console.log(this._playlist);

            this.popularTracks = [];
            this.isLoading = true;
            combineLatest([this.playlistService.getTopXPopularTracksOld(this.playlist.tracks.items.map(i => i.id), 10, this.token)]).pipe(finalize(() => {
                this.isLoading = false;
            })).subscribe(([popularTracks]: [Track[]]) => {
                popularTracks.forEach(i => this.popularTracks.push({ name: i.name.toString(), value: i.popularity }));
                this.getTempoData();
                this.artistData = this.getArtistData();
            })

        }
    }
    ngOnDestroy(): void {
        // destroy active subs
        this.onDestroy$.next();
    }

    ngOnInit(): void {

    }

    getTempoData() {
        if (this._playlist) {
            let slowest = this.playlist.tracks.items.sort((a, b) => {
                let aValue = a.features ? a.features.tempo : 0
                let bValue = b.features ? b.features.tempo : 0
                return aValue - bValue
            }).slice(0, 10);

            let fastest = this.playlist.tracks.items.sort((a, b) => {
                let aValue = a.features ? a.features.tempo : 0
                let bValue = b.features ? b.features.tempo : 0
                return bValue - aValue
            }).slice(0, 10);

            this.slowestTracks = this.createTempData(slowest)
            this.fastestTracks = this.createTempData(fastest)
        }
    }

    getArtistData(): any[] {

        let counts: any[] = [];
        for (var i = 0; i < this.playlist.tracks.items.length; i++) {
            let artist = this.playlist.tracks.items[i].artists[0];
            if (counts.filter(i => i.name === artist).length < 1) {
                counts.push({ name: this.playlist.tracks.items[i].artists[0], value: 1 })
            } else {
                counts.filter(i => i.name === artist)[0].value++;

            }

        }

        return counts;

    }

    private createTempData(simpleTrack: SimpleTrack[]) {
        let data: any[] = [];
        simpleTrack.forEach(track => {
            let tempo = track.features ? track.features?.tempo : 0;
            data.push({ name: track.name, value: Math.round(tempo) })
        })

        return data;

    }


}
