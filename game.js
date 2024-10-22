const SUPERBASE = require('./supabase')

let gameImagesList = []
let gameUserList = []
let gameIO = null
let responseCount = []
let currentIndex = 0

const initGame = (io, imageList, userList) => {
  gameIO = io
  gameImagesList = imageList
  gameUserList = userList
  currentIndex = 0
  responseCount = []
  sendImage(currentIndex)
}

const handleResponse = (data) => {
  console.log(data)
  responseCount.push(data.id)
  responseCount = [...new Set(responseCount)]
  console.log(`Received response from a user. Current count: ${responseCount}`)

  // Check if all users have responded
  if (responseCount.length === gameUserList.length) {
    console.log('All users have responded to the image.')
    responseCount = [] // Reset the count for the next image
    currentIndex += 1
    sendImage(currentIndex) // Send the next image
  }
}

// Function to send an image and wait for responses
const sendImage = (index) => {
  // If all images have been sent, exit the function
  if (index >= gameImagesList.length) {
    console.log('All images have been sent.')
    SUPERBASE.deleteAllFilesFromSupabase()
    gameIO.emit('game-end')
    return
  }

  const currentImage = gameImagesList[index]

  console.log(`Sending image ${index + 1}:`, currentImage)
  gameIO.emit('game-image', currentImage) // Emit the current image
}

// Create a Game object to encapsulate the methods
const GAME = {
  initGame,
  handleResponse,
  sendImage
}

module.exports = GAME
