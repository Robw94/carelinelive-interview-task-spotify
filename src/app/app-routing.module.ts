import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistBrowserComponent } from './components/playlist-browser/playlist-browser.component';

const routes: Routes = [{
    path: '',
    component: PlaylistBrowserComponent,
    children: [
    ],
  },];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
