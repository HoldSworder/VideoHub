class PromiseLimit {
  constructor(max, cb) {
    this.max = max
    this.cb = cb
    this.paths = []
    this.pool = []
    this.args = []
  }

  start(paths) {
    this.paths = [...paths]
    while(this.pool < this.max) {
      const path = this.paths.shift()
      this.setTask(path)
    }
    const race = Promise.race(this.pool)
    this.run(race)
  }

  run(race) {
    race.then(res => {
      const path = this.paths.shift()
      this.setTask(path)
      this.run(Promise.race(this.pool))
    })
  }

  setTask(path) {
    if(!path) return
    const promise = this.cb(path)
    this.pool.push(promise)

    promise.then(res => {
      this.pool.splice(this.pool.indexOf(promise), 1)
    })
  }
}

export default PromiseLimit