import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturedPlaylistsComponent } from './components/featured-playlists/featured-playlists.component';
import { FeaturedPlaylistsResolver } from './components/featured-playlists/featured-playlists.resolver';
import { PlaylistAnalysisComponent } from './components/playlist-analysis/playlist-analysis.component';
import { PlaylistBrowserComponent } from './components/playlist-browser/playlist-browser.component';
import { TrackStatsComponent } from './components/track-stats/track-stats.component';

const routes: Routes = [{
  path: '',
  component: PlaylistBrowserComponent,
  children: [
  ],
},
{
  path: 'featured',
  component: FeaturedPlaylistsComponent,
  resolve: {
    staticData: FeaturedPlaylistsResolver
  },
  children: [
  ],
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
