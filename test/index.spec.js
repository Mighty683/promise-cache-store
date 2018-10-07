import PromiseCache from '..'

describe('store helper', () => {
  it('should be defined', () => {
    expect(PromiseCache).toBeDefined()
  })

  describe('refresh mark', function () {
    beforeEach(function () {
      this.fun1 = function () {
      }
      this.error = new Error()
      spyOn(this, 'fun1').and.returnValue(Promise.resolve('1'))
      this.testStore = [
        {
          key: 'key_2',
          action: this.fun1,
          data: '2'
        },
        {
          key: 'key_3',
          action: () => Promise.resolve(),
          updateArray: ['key_2']
        }
      ]
      this.testCache = new PromiseCache(this.testStore, {
        cacheTime: 100
      })
    })

    it('should update result of another key after call', function (done) {
      this.testCache.get('key_2').then(result => {
        expect(result).toBe('2')
        this.testCache.get('key_3').then(() => {
          this.testCache.get('key_2').then(result => {
            expect(result).toBe('1')
            done()
          })
        })
      })
    })
  })

  describe('get', function () {
    beforeEach(function () {
      this.fun1 = function () {
      }
      this.error = new Error()
      spyOn(this, 'fun1').and.returnValue(Promise.resolve('1'))
      this.testStore = [
        {
          key: 'key_1',
          action: this.fun1
        },
        {
          key: 'key_2',
          data: '2'
        },
        {
          key: 'key_3',
          action: () => Promise.reject(this.error)
        }
      ]
      this.testCache = new PromiseCache(this.testStore, {
        cacheTime: 100
      })
      jasmine.clock().install()
      jasmine.clock().mockDate()
    })

    afterEach(() => {
      jasmine.clock().uninstall()
    })

    it('should call function and set data to store', function (done) {
      this.testCache.get('key_2').then((result) => {
        expect(this.fun1).not.toHaveBeenCalled()
        expect(result).toBe('2')
        done()
      })
    })

    it('should call function and set data to store', function (done) {
      this.testCache.get('key_1').then(() => {
        expect(this.fun1).toHaveBeenCalled()
        expect(this.testCache.store[0].data).toBe('1')
        done()
      })
    })

    it('should call function once', function (done) {
      this.testCache.get('key_1').then(() => {
        this.testCache.get('key_1').then(() => {
          expect(this.fun1.calls.count()).toBe(1)
          done()
        })
      })
    })

    it('should call function twice', function (done) {
      this.testCache.get('key_1').then(() => {
        jasmine.clock().tick(12321432432)
        this.testCache.get('key_1').then(() => {
          expect(this.fun1.calls.count()).toBe(2)
          done()
        })
      })
    })

    it('should call function twice after call time', function (done) {
      this.testCache.get('key_1').then(() => {
        this.testCache.get('key_1', {
          refresh: true
        }).then(() => {
          expect(this.fun1.calls.count()).toBe(2)
          done()
        })
      })
    })

    it('should reject on promise rejection', function (done) {
      this.testCache.get('key_3').catch(err => {
        expect(err).toBe(this.error)
        done()
      })
    })
  })

  describe('set', function () {
    beforeEach(function () {
      this.testStore = [
        {
          key: 'key_1'
        }
      ]
      this.testCache = new PromiseCache(this.testStore, {
        cacheTime: 100
      })
    })

    it('should add key to store', function () {
      this.testCache.set('key_2', {
        action: () => Promise.resolve()
      })
      expect(this.testCache.store.length).toBe(2)
    })

    it('should update key in store', function (done) {
      this.testFun = () => {}
      spyOn(this, 'testFun').and.returnValue(Promise.resolve('result'))
      this.testCache.set('key_1', {
        action: this.testFun
      })
      this.testCache.get('key_1').then(result => {
        expect(result).toBe('result')
        expect(this.testFun).toHaveBeenCalled()
        done()
      })
    })

    it('should add key to store with proper action', function (done) {
      this.testCache.set('key_2', {
        action: () => Promise.resolve('2')
      })
      this.testCache.get('key_2').then(result => {
        expect(result).toBe('2')
        done()
      })
      expect(this.testCache.store.length).toBe(2)
    })
  })

  describe('remove', function () {
    beforeEach(function () {
      this.testStore = [
        {
          key: 'key_1'
        }
      ]
      this.testCache = new PromiseCache(this.testStore, {
        cacheTime: 100
      })
    })

    it('should remove key from store', function () {
      this.testCache.remove('key_1')
      expect(this.testCache.store.length).toBe(0)
    })
  })
})
