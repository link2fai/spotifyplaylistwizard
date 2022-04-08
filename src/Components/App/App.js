import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { searchResults : [{
          name : "Tiny Dancer",
          artist : "Elton John",
          album : "Madman Across The Water",
          id : 1
        },
        {
          name : "Tiny Dancer",
          artist : "Tim McGraw",
          album : "Love Story",
          id : 2

        },{
          name : "Tiny Dancer",
          artist : "Rockabye Baby!",
          album : "Lullaby Renditions of Elton John",
          id : 3
        },{
          name : "Tiny Dancer",
          artist : "The White Raven",
          album : "Tiny Dancer",
          id : 4
        },{
          name : "Tiny Dancer - Live Album Version",
          artist : "Ben Folds",
          album : "Ben Folds Live",
          id : 5
        }
      ],
      playlistName : "New Playlist",
      playlistTracks : []
    };
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks : tracks});
  }


  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({playlistTracks : tracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName : name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: "New Playlist"});
    this.setState({playlistTracks : []});
  }

  search(term){
    Spotify.search(term).then(searchResults => {
        this.setState({searchResults : searchResults});
        console.log(searchResults);
    });
    
  }


  render(){
    return (
    
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* Add a SearchBar component */}
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            {/* Add a SearchResults component */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            {/* Add a Playlist component */}
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
  
}