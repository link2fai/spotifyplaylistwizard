import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track.js';
 export class TrackList extends React.Component {
 	render(){

 		const trackList = this.props.tracks.map((track) =>{
 			return <Track 
 				key={track.id}
 				track={track}
 				isRemoval={this.props.isRemoval}
 				onAdd={this.props.onAdd}
 				onRemove = {this.props.onRemove}
 			/>;
 		});
 		return(
 			<div className="TrackList">
    			{/*<!-- You will add a map method that renders a set of Track components  -->*/}
    			{trackList}

			</div>
 		);
 	}
 }