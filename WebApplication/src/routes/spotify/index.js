/* path: /spotify */

const router = require('express').Router();
const request = require('request');

const env = require('../../environment');
const { isAuthorized } = require('../../session');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: '8e4566423d5940e9a8c13203cd8de788',
    clientSecret: 'bcd3ed3db9444dd8aa18a5be6feb15e0',
    redirectUri: 'http://localhost:3000/api/sas/spotify/callback'
});

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

module.exports = router;