```
{track object}: {
    album: {album object}
    artists: [LIST OF {artist object}s] 
    available_markets: [LIST OF STRINGs]
    disc_number: NUMBER
    duration_ms: NUMBER
    explicit: BOOLEAN
    id: STRING
    is_local: BOOLEAN
    name: STRING
    popularity: NUMBER // [0-100]
    preview_url: STRING
    track_number: NUMBER
    url: STRING
    genres: [LIST OF STRINGs]
}
```

```
{album object}: {
    album_type: STRING // 'album' || 'single' || 'compilation'
    artists: [LIST OF {artists object}s]
    available_markets: [LIST OF STRINGs]
    id: STRING
    images: [LIST OF {image object}s]
    name: STRING
    release_date: STRING // '2020-01-30' || '2020-01' || '2020'.
    release_date_precision: 'year' || 'month' || 'day'
    total_tracks: NUMBER
    url: STRING
}
```

```
{image object}: {
    height: NUBMER
    url: STRING
    width: NUMBER
}
```