import React from 'react'
import { BrowserRouter as Router, Route } from  'react-router-dom'

import Index from '@/pages/index/index.js'
import Watch from '@/pages/watch/watch.js'

function Main() {
  return (
    <Router>
      <div>
        <Route path='/' exact component={Index} />
        <Route path='/watch' exact component={Watch} />
      </div>
    </Router>
  )
}

export default Main