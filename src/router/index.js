import React from 'react'
import { BrowserRouter as Router, Route } from  'react-router-dom'

import Index from '@/pages/index/index.js'

function Main() {
  return (
    <Router>
      <div>
        <Route path='/' exact component={Index} />
      </div>
    </Router>
  )
}

export default Main