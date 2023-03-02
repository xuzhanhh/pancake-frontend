import React, { useContext } from 'react'
import { getEnv } from 'utils/bmp/getEnv'
import { GoogleAnalytics } from '../utils/ga'

const initTracker = {
  // ...
  tracker: null,
  getTracker() {
    if (!this.tracker) {
      // init GoogleAnalytics Tracker
      this.tracker = GoogleAnalytics.getInstance(this)
        .setAppName('pancake-mini')
        .setAppVersion('1.0.0')
        .newTracker('UA-222280594-1') // replace with your Tracking ID
    }
    return this.tracker
  },
  // ...
}

const AnalyticsContext = React.createContext(initTracker)

const useTracker = () => {
  const context = useContext(AnalyticsContext)
  const tracker = context.getTracker()
  if (tracker && getEnv() !== 'prod') {
    tracker.send = () => {
      console.log('~ no prod tracker')
      // noop
    }
  }
  return tracker
}

const AnalyticsProvider = ({ children }) => (
  <AnalyticsContext.Provider value={initTracker}>{children}</AnalyticsContext.Provider>
)

export { AnalyticsProvider, useTracker }
