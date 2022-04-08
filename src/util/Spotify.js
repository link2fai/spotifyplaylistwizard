const clientId = 'df4581fda3b447bd83e338454db44bf4';
const redirectUri = 'https://spotifyplaylistwizard.surge.sh/';
let scope = 'playlist-modify-public';
let accessToken; 
const Spotify = {
	getAccessToken(){
		if(accessToken){
			return accessToken;
		}
		const accessTokenCheck = window.location.href.match(/access_token=([^&]*)/);
		const expiresInCheck = window.location.href.match(/expires_in=([^&]*)/);
		
		if(accessTokenCheck && expiresInCheck){
			accessToken = accessTokenCheck[1];
			const expiresIn = Number(expiresInCheck[1]);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			let url = 'https://accounts.spotify.com/authorize';
			url += '?client_id=' + encodeURIComponent(clientId);
			url += '&response_type=token';
			url += '&scope=' + encodeURIComponent(scope);
			url += '&redirect_uri=' + encodeURIComponent(redirectUri);
			window.location = url;

		}
		console.log(accessToken);

	},

	search(term){
		const accessToken = Spotify.getAccessToken();
		const headers = {Authorization: `Bearer ${accessToken}`};
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
			{headers : headers}
			).then(response => {
				return response.json();
			}).then(jsonResponse =>{
				console.log(jsonResponse);

				if(!jsonResponse.tracks){
					return [];
				}
				return jsonResponse.tracks.items.map(track =>({
					id : track.id,
					name : track.name,
					artist : track.artists[0].name,
					album : track.album.name,
					uri : track.uri

				}));
		});	
	},

	savePlaylist(playlistName, trackURIs){
		if(!playlistName || !trackURIs){
			return;
		}
		const accessToken = Spotify.getAccessToken();
		const headers  = {Authorization: `Bearer ${accessToken}`};
		let userId;
		let playlistId;

		async function getUserId(){
			const response = await fetch('https://api.spotify.com/v1/me',{headers : headers});
			let jsonResponse;
			if(response.ok){
				jsonResponse = await response.json();
			}else{
				throw new Error (`Request Failed! ${response.status}, ${response.message}`); 
			}
			userId = jsonResponse.id;
		}

		async function createPlaylist(){
			const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
				{
					headers : headers,
					method: 'POST',
					body: JSON.stringify({name: playlistName})
			});
			if(response.ok){
				const jsonResponse = await response.json();
				playlistId = jsonResponse.id;
			}else{
				throw new Error(`Request failed! ${response.status}, ${response.message}`);
			}

		}

		async function updatePlaylist(){
			const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        		headers: headers,
        		method: 'POST',
        		body: JSON.stringify({uris: trackURIs})
      		});
      		if(response.ok){
      			console.log(response);
      		}else{
      			throw new Error(`Request failed! ${response.status}, ${response.message}`);
      		}
		}

		async function save(){
			try{
				await getUserId();
				await createPlaylist();
				await updatePlaylist();

			}catch(error){
				console.log(error);
			}

		}

		save();

	}
};
export default Spotify;