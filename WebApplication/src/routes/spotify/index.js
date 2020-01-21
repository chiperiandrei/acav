/* path: /spotify */

const router = require('express').Router();
const request = require('request');

const env = require('../../environment');
const { isAuthorized } = require('../../session');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

router.get('/artists', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/artists`);

    const tokenUri = `${env.WA.URI}/connect/spotify/token`;
    const sess = req.session;

    if (sess.user.spotify) {
        request.post(tokenUri, {
            json: { refresh_token: sess.user.spotify.refresh_token }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                sess.user.spotify.token = body.token;

                const token = sess.user.spotify.token;

                const renderData = {
                    email: sess.user.email,
                    spotify: {
                        href: sess.user.spotify.href,
                        name: sess.user.spotify.name,
                        picture: sess.user.spotify.picture
                    }
                };

                let temporary = [];

                spotifyApi.setAccessToken(token);

                spotifyApi.getFollowedArtists({  limit: 20 })
                    .then((data) => {
                        const d = data.body.artists;

                        for (const i of d.items) {
                            const o = {
                                href: i.external_urls.spotify,
                                genres: i.genres,
                                id: i.id,
                                name: i.name
                            };

                            let index = i.images.length - 1;
                            while (i.images[index].width < 160) {
                                index--;
                            }
                            o.picture = i.images[index].url;

                            temporary.push(o);

                        }

                        renderData.spotify.artists = shuffle(temporary);

                        res.render('home', renderData)
                    }, (err) => {
                        console.error(err);
                    });
            }
        });
    } else {
        res.redirect('/');
    }
});

router.get('/playlists', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/playlists`);

    const tokenUri = `${env.WA.URI}/connect/spotify/token`;
    const sess = req.session;

    if (sess.user.spotify) {
        request.post(tokenUri, {
            json: { refresh_token: sess.user.spotify.refresh_token }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                sess.user.spotify.token = body.token;

                const token = sess.user.spotify.token;

                const renderData = {
                    email: sess.user.email,
                    spotify: {
                        href: sess.user.spotify.href,
                        name: sess.user.spotify.name,
                        picture: sess.user.spotify.picture
                    }
                };

                let temporary = [];

                spotifyApi.setAccessToken(token);

                spotifyApi.getUserPlaylists(sess.user.spotify.id)
                    .then(data => {
                        const d = data.body;

                        for (const i of d.items) {
                            const playlist = {
                                name: i.name,
                                href: i.external_urls.spotify,
                                id: i.id,
                                picture: i.images[0].url
                            };
                            temporary.push(playlist);
                        }

                        renderData.spotify.playlists = temporary;

                        res.render('home', renderData);

                        // [Deny] #forSongs
                        // const playlist = renderData.spotify.playlists[1];
                        //
                        // spotifyApi.getPlaylistTracks(playlist.id, { limit: 100 })
                        //     .then(data => {
                        //         console.log(data.body.items)
                        //     }, err => {
                        //         console.error(err);
                        //     });

                    }, err => {
                        console.error(err);
                    });
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;