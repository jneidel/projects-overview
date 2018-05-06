# Public API

Via the public API you can access your current projects.

## Setup

Generate an api key at the [/account](https://po.jneidel.com/account) page.

## API

### /api/public

<table><tr>
  <td>Method: <code>POST</code></td>
  <td>Param: <code>key</code></td>
</tr></table>

```
curl -X POST https://po.jneidel.com/api/public -d '{ "key": <your-api-key> }' -H "Content-Type: application/json"
```

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
