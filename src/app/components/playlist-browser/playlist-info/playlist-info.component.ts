import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlaylistSearchResult } from 'src/app/services/spotify/spotify-api.service';

@Component({
  selector: 'app-playlist-info',
  templateUrl: './playlist-info.component.html',
  styleUrls: ['./playlist-info.component.scss']
})
export class PlaylistInfoComponent implements OnInit {

  @Input() playlistSearchResult!: PlaylistSearchResult;

  @Output() playlistSelected = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  onPlaylistSelected(playlist: string): void {

    this.playlistSelected.emit(playlist);
  }
}
