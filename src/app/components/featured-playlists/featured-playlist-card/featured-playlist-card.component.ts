import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from 'src/app/services/spotify/models/featured-playlist';

@Component({
  selector: 'app-featured-playlist-card',
  templateUrl: './featured-playlist-card.component.html',
  styleUrls: ['./featured-playlist-card.component.scss']
})
export class FeaturedPlaylistCardComponent implements OnInit {

  @Input() playlist!: Playlist;
  constructor() { }

  ngOnInit(): void {
  }

}
