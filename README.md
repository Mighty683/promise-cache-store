# promise-cache

## Cache store for Promise execution

Mainly designed as store for cache request.

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
| Param | Value         | Description | Required |
| ----- | ------------- | ----------- | -------- |
| store | Array<{key: string, action: Function<Promise>}> | Array of predefined actions | false |
| cacheTime | Number | Valid age of cached value | false |

### set

| Param | Value         | Description | Required |
| ----- | ------------- | ----------- | -------- |
| key   | string        | key value for new cache | true |
| action | () => Promise | function returning promise | true |
| options | {} | todo | false |

### get

| Param | Value         | Description | Required |
| ----- | ------------- | ----------- | -------- |
| key   | string        | key value for cache | true |
| options.refresh | boolean | Force call to refresh cache | false |