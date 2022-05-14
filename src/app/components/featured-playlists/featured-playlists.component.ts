import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFeaturedPlaylistsStaticData } from './featured-playlists.resolver';

@Component({
  selector: 'app-featured-playlists',
  templateUrl: './featured-playlists.component.html',
  styleUrls: ['./featured-playlists.component.scss']
})
export class FeaturedPlaylistsComponent implements OnInit {

  staticData!: IFeaturedPlaylistsStaticData;
  constructor(private activatedRoute: ActivatedRoute) {
    this.staticData = <IFeaturedPlaylistsStaticData>this.activatedRoute.snapshot.data['staticData'];

    console.log(this.staticData.featuredPlaylists);
    
  }

  ngOnInit(): void {

  }

}
