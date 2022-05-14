import { Details } from "../spotify-playlist.service";

    export interface ExternalUrls {
        spotify: string;
    }

    export interface Image {
        height?: any;
        url: string;
        width?: any;
    }

    export interface ExternalUrls2 {
        spotify: string;
    }

    export interface Owner {
        display_name: string;
        external_urls: ExternalUrls2;
        href: string;
        id: string;
        type: string;
        uri: string;
    }

    export interface Tracks {
        href: string;
        total: number;
    }

    export interface Playlist {
        description: string;
        href: string;
        id: string;
        images: Image[];
        name: string;
        primary_color?: any;
        public?: any;
        tracks: Tracks;
        type: string;
        uri: string;
        details: Details;
    }

    export interface FeaturedPlaylist {
        href: string;
        items: Playlist[];
        limit: number;
        next?: any;
        offset: number;
        previous?: any;
        total: number;
    }

    export interface FeaturedPlaylistParent {
        message: string;
        playlists: FeaturedPlaylist;
    }



