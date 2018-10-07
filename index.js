class PromiseCache {
  constructor (store, options) {
    this.store = store || []
    this.cacheTime = options && options.cacheTime
  }

  _updateElement (element, options) {
    element.action = options.action
    element.updateArray = options.updateArray
  }
  _addElement (key, options) {
    this.store.push({
      key,
      ...options
    })
  }

  _callAction (element) {
    if (element.updateArray && element.updateArray instanceof Array) {
      element.updateArray.forEach(
        keyToRefresh => {
          this._markRefresh(keyToRefresh)
        }
      )
    }
    element.refresh = false
    return element.action()
  }

  _markRefresh (key) {
    this.getElementByKey(key).refresh = true
  }

  shouldElementUpdate (element) {
    return !element.data || element.refresh || (this.cacheTime && Math.abs(element.timeStamp - Date.now()) > this.cacheTime)
  }

  set (key, options) {
    const element = this.getElementByKey(key)
    if (options) {
      if (element) {
        if (options.force) {
          this.remove(key)
          this._addElement(key, options)
        } else {
          this._updateElement(element, options)
        }
      } else {
        this._addElement(key, options)
      }
    } else {
      throw new Error('Options are required')
    }
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
          this._callAction(element).then((response) => {
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

  remove (key) {
    const index = this.store.findIndex(element => element.key === key)
    if (index !== -1) {
      this.store.splice(index, 1)
    }
  }

  getElementByKey (key) {
    return this.store.find(el => el.key === key)
  }
}

export default PromiseCache
