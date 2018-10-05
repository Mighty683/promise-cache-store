class PromiseCache {
  constructor (store, options) {
    this.store = store
    this.cacheTime = options && options.cacheTime
  }

  shouldElementUpdate (element) {
    return !element.data || (this.cacheTime && Math.abs(element.timeStamp - Date.now()) > this.cacheTime)
  }

  set (key, action) {
    this.store.push({
      key,
      action
    })
  }

  get (key, options) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        refresh: false
      }
      const mergedOptions = {
        ...defaultOptions,
        ...options
      }
      const element = this.getElementByKey(key)
      if (element) {
        if (mergedOptions.refresh || this.shouldElementUpdate(element)) {
          element.action().then((response) => {
            element.data = response
            element.timeStamp = Date.now()
            resolve(response)
          }).catch((response) => {
            reject(response)
          })
        } else {
          resolve(element.data)
        }
      } else {
        reject(new Error())
      }
    })
  }

  getElementByKey (key) {
    return this.store.find(el => el.key === key)
  }
}

export default PromiseCache
