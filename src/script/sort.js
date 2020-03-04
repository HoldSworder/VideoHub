function sort(type, files) {
  switch(type) {
    case 'TIME POSITIVE':
      files.sort((a, b) => {
        return a.create - b.create
      })
      break
    case 'TIME NEGATIVE': 
      files.sort((a, b) => {
        return b.create - a.create
      })
      break
  }
}

export default sort