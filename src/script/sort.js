function sort(type, files) {
  let data = [...files]
  switch(type) {
    case 'TIME POSITIVE':
      data = data.sort((a, b) => {
        return a.create - b.create
      })
      break
    case 'TIME NEGATIVE': 
      data = data.sort((a, b) => {
        return b.create - a.create
      })
      break
    case 'DURATION POSITIVE':
      data = data.sort((a, b) => {
        return a.durationOrigin - b.durationOrigin
      })
      break
    case 'DURATION NEGATIVE': 
      data = data.sort((a, b) => {
        return b.durationOrigin - a.durationOrigin
      })
      break
    case 'CAN NOT PLAY': 
      data = data.filter(x => {
        return x.canplay === 2
      })
      break
    case 'ERROR':
      data = data.filter(x => {
        return x.canplay === 0
      })
  }
  console.log(data)
  return data
}

export default sort