import React from 'react'
import { BrowserRouter, Route, Switch, HashRouter } from  'react-router-dom'

import Index from '@/pages/index/index.js'
import Watch from '@/pages/watch/watch.js'

function Main() {
  return (
    <HashRouter>
      <div>
        <Route path='/' exact component={Index} />
        <Route path='/watch' exact component={Watch} />
      </div>
    </HashRouter>
  )
}

export default Main