import { InjectionToken } from '@angular/core';

// Although the ApplicationConfig interface plays no role in dependency injection, 
// it supports typing of the configuration object within the class.
export interface ApplicationConfig {
 	STATIONS: any;
}

// Configuration values for our app
export const AppConfig: ApplicationConfig = {
	STATIONS : [{
		name: "24 Hour Kirtan Radio",
		metadata_url: "http://icecast.24hourkirtan.fm:8000/status-json.xsl",
		api_url: "https://api.kirtan.io",
		hiFi: 'http://icecast.24hourkirtan.fm:8000/128k.mp3',
	    loFi: 'http://icecast.24hourkirtan.fm:8000/64k.mp3'
	}, {
		name: "Raydio",
		metadata_url: "http://icecast.24hourkirtan.fm:8000/status-json.xsl",
		api_url: "https://api.kirtan.io",
		hiFi: 'http://icecast.24hourkirtan.fm:8000/128k.mp3',
	    loFi: 'http://icecast.24hourkirtan.fm:8000/64k.mp3'
	}]
};

// Create a config token to avoid naming conflicts
export const APP_CONFIG = new InjectionToken('app-config');