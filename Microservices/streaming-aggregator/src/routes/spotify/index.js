/* path: /spotify */

const router = require('express').Router();
const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

const env = require('../../environment');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

const fs = require('fs');

// application requests authorization
router.get('/login', (req, res) => {
    env.log('GET', `${env.SAS.URI}/spotify/login`);

    const state = crypto.randomBytes(64).toString('hex');
    res.cookie(env.SAS.SPOTIFY.STATE_KEY, state);

    // redirect for ACAV WA
    if (req.query) {
        req.session.redirectUri = req.query.redirectUri;
        req.session.email = req.query.email;
        req.session.token = req.query.token;
    }

    // redirect from Spotify API
    const redirectUri = `${env.SAS.URI}/spotify/callback`;

    const scope = 'user-read-private user-read-email user-library-read user-follow-read';
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: env.SAS.SPOTIFY.CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    }));
});

// application requests refresh and access tokens
// after checking the state parameter
router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[env.SAS.SPOTIFY.STATE_KEY] : null;
    const redirectUri = `${env.SAS.URI}/spotify/callback`;

    const responseUri = req.session.redirectUri;
    const wa = { token: req.session.token };

    if (state === null || state !== storedState) {
        res.redirect(responseUri + '/#' + querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(env.SAS.SPOTIFY.STATE_KEY);
        const buffer = Buffer.from(env.SAS.SPOTIFY.CLIENT_ID + ':' + env.SAS.SPOTIFY.CLIENT_SECRET);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': `Basic ${buffer.toString('base64')}`
            },
            form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
            json: true
        };
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const refresh_token = body.refresh_token;
                const access_token = body.access_token;

                env.log(
                    'GET',
                    `${env.SAS.URI}/spotify/callback`,
                    {
                        access_token: access_token.slice(0, 15) + ' [...]',
                        refresh_token: refresh_token.slice(0, 15) + ' [...]'
                    },
                    true
                );

                // Request to ACAV WA, data for Front-end
                request.post(responseUri, {
                    json: {
                        spotify: {
                            token: access_token,
                            refresh_token: refresh_token
                        },
                        wa
                    }
                }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        env.log(
                            'POST',
                            responseUri,
                            {
                                access_token: access_token.slice(0, 15) + ' [...]',
                                refresh_token: refresh_token.slice(0, 15) + ' [...]'
                            },
                            false);

                        res.redirect(responseUri + '/?' + querystring.stringify({
                            wa: wa.token
                        }));
                    }
                });

                // Request to Spotify, data for Profiling
                spotifyApi.setAccessToken(access_token);



                spotifyApi.getMySavedTracks({ limit: 50 })
                .then(data => {
                    const d = data.body;
                    let result = [];

                    for (const i of d.items) {
                        const t = i.track;

                        const track = {
                            album: {},
                            artists: [],
                            available_markets: t.available_markets,
                            disc_number: t.disc_number,
                            duration_ms: t.duration_ms,
                            explicit: t.explicit,
                            id: t.id,
                            is_local: t.is_local,
                            name: t.name,
                            popularity: t.popularity,
                            preview_url: t.preview_url,
                            track_number: t.track_number,
                            url: undefined
                        };
                        if (t.external_urls) {
                            track.url = t.external_urls.spotify;
                        }

                        const album = {
                            album_type: t.album.album_type,
                            artists: [],
                            available_markets: t.album.available_markets,
                            id: t.album.id,
                            images: t.album.images,
                            name: t.album.name,
                            release_date: t.album.release_date,
                            release_date_precision: t.album.release_date_precision,
                            total_tracks: t.album.total_tracks,
                            url: undefined
                        };
                        if (t.album.external_urls) {
                            album.url = t.album.external_urls.spotify
                        }

                        for (const a of t.album.artists) {
                            const artist = {
                                id: a.id,
                                name: a.name,
                                url: undefined
                            };
                            if (a.external_urls) {
                                artist.url = a.external_urls.spotify
                            }
                            album.artists.push(artist)
                        }

                        track.album = album;

                        for (const a of t.artists) {
                            const artist = {
                                id: a.id,
                                name: a.name,
                                url: undefined
                            };
                            if (a.external_urls) {
                                artist.url = a.external_urls.spotify
                            }
                            track.artists.push(artist)
                        }

                        result.push(track);
                    }

                    return result;
                }, err => {
                    console.error(err);

                }).then(data => {
                    for (let i = 0; i < data.length; i++) {
                        spotifyApi.getArtist(data[i].artists[0].id)
                        .then(new_data => {
                            data[i].genres = new_data.body.genres;
                            if (i === data.length - 1) {
                                // [TODO:] Send Your Request to Paul!
                                return data;
                            }
                        }, err => {
                            console.log(err);
                        }).then(data => {
                            console.log(data);
                        }, err => {
                            console.log(err)
                        });
                    }
                }, err => {
                    console.error(err);
                });
            } else {
                env.message('Login failed!');

                return res.status(403).json({ message: 'invalid token' });
            }
        });
    }
});

// requesting access token from refresh token
router.post('/token', (req, res) => {
    env.log('GET', `${env.SAS.URI}/spotify/token`);

    const refresh_token = req.body.refresh_token;

    const buffer = Buffer.from(env.SAS.SPOTIFY.CLIENT_ID + ':' + env.SAS.SPOTIFY.CLIENT_SECRET);
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': `Basic ${buffer.toString('base64')}`
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json({ access_token: body.access_token })
        }
    });
});

module.exports = router;