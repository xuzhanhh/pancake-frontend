import mpService from '@binance/mp-service'

const fetch = (url, options = {}) => {
  console.log('????? fetch')
  const promise = new Promise((resolve, reject) => {
    mpService.request({
      url,
      method: options.method || 'GET',
      data: options.body,
      header: options.headers,
      success: (res) => {
        console.log('???? success', res)
        const { data, header } = res

        if (res.statusCode >= 200 && res.statusCode < 300) {
          res.ok = true
        }
        res.headers = {
          get: (key) => res.header[key.toLowerCase()],
        }
        res.json = function () {
          if (typeof this.data === 'object') {
            return this.data
            // res(data);
          }
          return JSON.parse(res.data)
        }
        if (header['content-type']?.indexOf('application/json') > -1) {
          if (typeof data === 'object') {
            resolve(res)
            return
          }

          try {
            const json = JSON.parse(res.data)
            res.data = json
            resolve(res)
          } catch (e) {
            if (typeof e === 'string') {
              reject(new Error(e))
            } else if (e instanceof Error) {
              reject(e)
            }
          }
        } else {
          res(data)
        }
      },
      fail: (response) => reject(new Error(response.errMsg)),
    })
  }).catch((reason) => {
    throw reason
  })

  return promise
}
export default fetch
