export function getNoteHeader(config, fname) {
  const { firstName, lastName, fileHeader } = config
  if (fileHeader == 0) {
    return ''
  } else if (fileHeader == 1) {
    return `<h1>${fname}</h1><p>${firstName} ${lastName}</p><p>${getCurrentDate()}</p><hr></hr>`
  } else if (fileHeader == 2) {
    return `<h1 style="text-align: center">${fname}</h1><p style="text-align: center">${firstName} ${lastName}</p><p style="text-align: center">${getCurrentDate()}</p><hr></hr>`
  } else if (fileHeader == 3) {
    return `<h1>${fname}</h1><p>${getCurrentDate()}</p><hr></hr>`
  } else if (fileHeader == 4) {
    return `<h1 style="text-align: center">${fname}</h1><p style="text-align: center">${getCurrentDate()}</p><hr></hr>`
  }
}

function getCurrentDate() {
  const currentDate = new Date()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  const year = currentDate.getFullYear()

  return `${month}/${day}/${year}`
}
