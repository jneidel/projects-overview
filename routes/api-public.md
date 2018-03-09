# Public API

Via the public API you can access your current projects.

## Setup

Generate an api key at the [/account](https://po.jneidel.com/account) page.

## Usage

```
POST https://po.jneidel.com/api/public?key=<your-api-key>
```

## API

Only one route is available at the moment:

### /api/public

Type: `POST`

Requires api key via the `key` query parameter `/api/public?key=<your-api-key>`.

Returns a JSON of the following structure:

```json
{
  "cards": [
    {
      "title": "Comics/Manga",
      "items": [
        "Attack on Titan",
        "One Punch Man",
        "The Walking Dead"
      ]
    },
    {
      "title": "Books",
      "items": [
        "Seveneves",
        "YDKJS"
      ]
    }
  ]
}
```
