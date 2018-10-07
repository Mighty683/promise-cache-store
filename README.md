# promise-cache

## Cache store for Promise execution

[![pipeline status](https://git.migum.eu/migum/promise-cache/badges/master/pipeline.svg)](https://git.migum.eu/migum/promise-cache/commits/master)
[![coverage report](https://git.migum.eu/migum/promise-cache/badges/master/coverage.svg)](https://git.migum.eu/migum/promise-cache/commits/master)

Mainly designed as store for cache request.
```
npm install promise-cache-store
```

Example: 
```js
  const cache = new CacheStore([] , 60)
  cache.set('request', () => axios.get('http://my.url'))
  const response = await cache.get('request')
  const secondResponse = await cache.get('request')
```

Get request will be called only once, get function will return result of initial call.

### Constructor
Create cache store with passed options.

| Param     | Value                                       | Description                 | Required |
| --------- | ------------------------------------------- | --------------------------- | -------- |
| store     | Array<{key: string, action: () => Promise}> | Array of predefined actions | false    |
| cacheTime | Number                                      | Valid age of cached value   | false    |

### set
Add new key to cache.

| Param   | Value         | Description                | Required |
| ------- | ------------- | -------------------------- | -------- |
| key     | string        | key value for new cache    | true     |
| options.action  | () => Promise | function returning promise | true     |
| options.updateArray | [string]           | Keys to mark for update. Marked key will be forced to update on next call.                       | false    |

### get
Get data from key.

| Param | Value         | Description | Required |
| ----- | ------------- | ----------- | -------- |
| key   | string        | key value for cache | true |
| options.refresh | boolean | Force call to refresh cache | false |


### Examples

For more examples check test folder.

Update array:
On call you are able to mark another keys for update. On next call marked keys will update result.

```js
var testCache = new PromiseCache([
  {
    key: 'key_2',
    action: () => Promise.resolve('1'),
    data: '2'
  },
  {
    key: 'key_3',
    action: () => Promise.resolve(),
    updateArray: ['key_2']
  }
])
const result1 = await testCache.get('key_2')
/* result1 = '2' */
await testCache.get('key_3')
const result2 = await testCache.get('key_2')
/* result2 = '1' */
```