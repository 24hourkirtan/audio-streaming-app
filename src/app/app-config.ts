import { InjectionToken } from '@angular/core';

// Although the ApplicationConfig interface plays no role in dependency injection, 
// it supports typing of the configuration object within the class.
export interface ApplicationConfig {
	METADATA_URL: string;
	API_URL: string;
 	STATIONS: any;
}

// Configuration values for our app
export const AppConfig: ApplicationConfig = {
	METADATA_URL: "http://server.24hourkirtan.fm:8000/status-json.xsl",
	API_URL: "https://api.kirtan.io",
	STATIONS : [{
		name: "24 Hour Kirtan Radio",
		alias: "24 Hour Kirtan Radio",
		hiFi: 'http://icecast.24hourkirtan.fm:8000/128k.mp3',
	    loFi: 'http://icecast.24hourkirtan.fm:8000/64k.mp3',
	    METADATA_URL: "http://icecast.24hourkirtan.fm:8000/status-json.xsl"
	}, {
		name: "Raydio Kirtan",
		alias: "Raydio",
		hiFi: 'http://server.24hourkirtan.fm:8000/raydio128k.mp3',
	    loFi: 'http://server.24hourkirtan.fm:8000/raydio64k.mp3',
	    METADATA_URL: "http://server.24hourkirtan.fm:8000/status-json.xsl"
	}]
};

// Create a config token to avoid naming conflicts
export const APP_CONFIG = new InjectionToken('app-config');