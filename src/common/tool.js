const fsp = window.require('fs').promises
const path = window.require('path')

function transTime(time) {
  let hour = String(parseInt((time) / 3600))
  let minute = String(parseInt((time % 3600) / 60))
  let second = String(Math.ceil(time % 60))
  hour = hour.length > 1 ? hour : 0
  minute = minute.length > 1 ? minute : 0 + minute
  second = second.length > 1 ? second : 0 + second
  return `${Number(hour) === 0 ? '' : hour + ':'}${Number(minute) === 0 ? '' : minute + ':'}${second}`
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

export { isJSON, transTime }