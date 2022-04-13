
const clientID = '';
const redirectUri = 'https://spotifuey.surge.sh';

let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } 

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(()=> accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
                if(!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            }
        );
    },

    savePlaylist(playlistName, tracksURIs) {
        if(!playlistName || !tracksURIs) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}, 'Content-type': 'application/json'`}
        let userID;
        
        fetch(`https://api.spotify.com/v1/me`, {headers: headers}
        ).then(response => {
            return response.json()
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName})
            }).then(response => {
                return response.json()
            }).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                console.log(playlistID);
                console.log({uris: tracksURIs})
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({'uris': tracksURIs})
                })
            })
        })
    }

}

export default Spotify;