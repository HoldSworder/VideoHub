const fsp = window.require('fs').promises
const path = window.require('path')

function transTime(time) {
	time = parseInt(time)
  let hour = Math.floor((time) / 3600)
  let minute = Math.floor((time % 3600) / 60)
	let second = time % 3600 % 60

	if(hour < 10 && hour !== 0) hour = '0' + hour
	else if(hour === 0) hour = ''

	if(minute < 10 && minute !== 0) minute = '0' + minute
	else if(minute === 0 && hour !== '') minute = '00'
	else if(minute === 0 && hour === '') minute = ''

	if(second < 10 && second !== 0) second = '0' + second
	else if(second === 0 && hour === '' && minute === '') second = ''
	else if(second === 0 && (hour !== '' || minute !== '')) second = '00'

  return `${hour && hour + ':'}${minute && minute + ':' }${second}`
}

function isJSON(str) {
  if (typeof str == 'string') {
      try {
          var obj=JSON.parse(str);
          if(typeof obj == 'object' && obj ){
              return true;
          }else{
              return false;
          }

      } catch(e) {
          console.log('error：'+str+'!!!'+e);
          return false;
      }
  }
  console.log('It is not a string!')
}

function genId(randomLength = 5) {
    return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
}

export { isJSON, transTime, genId }