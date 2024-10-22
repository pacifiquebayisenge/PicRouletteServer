require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const uploadToSupabase = async (fileData) => {
  try {
    const { name, buffer, type } = fileData // Receive the buffer, name, and type

    // Check if the file already exists
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('images')
      .list('public', {
        limit: 1,
        search: name
      })

    if (listError) throw listError

    if (existingFiles.length > 0) {
      // File already exists, return its URL
      console.log(`File ${name} already exists, skipping upload.`)
      return `${supabaseUrl}/storage/v1/object/images/public/${name}`
    }

    // Upload the buffer directly to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`public/${name}`, buffer, { contentType: type })

    if (uploadError) throw uploadError

    console.log(`Successfully uploaded: ${name}`)
    const url = `${supabaseUrl}/storage/v1/object/public/images/${data.path}`
    return url
  } catch (error) {
    throw new Error('Failed to upload image: ' + error.message)
  }
}

const deleteAllFilesFromSupabase = async () => {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('public', { limit: 1000 }) // List files in the 'images' bucket

    if (listError) throw listError

    // Check if there are files to delete
    if (files.length === 0) {
      console.log('No files to delete.')
      return
    }

    // Iterate through the files and delete each one
    for (const file of files) {
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove(`public/${[file.name]}`)

      if (deleteError) {
        console.error(`Error deleting file ${file.name}:`, deleteError.message)
      } else {
        console.log(`Deleted file: ${file.name}`)
      }
    }

    console.log('All files have been processed for deletion.')
  } catch (error) {
    console.error('Error deleting files:', error.message)
  }
}

const getFilesStartingWith = async (userId) => {
  try {
    // List all files in the specified bucket
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('public/', { limit: 1000 })

    if (listError) throw listError

    // Filter files that start with the specified userId
    const filteredFiles = files.filter((file) => file.name.split(':')[0] === userId)

    // Check if there are files to delete
    if (filteredFiles.length === 0) {
      console.log(`No files starting with id =>  ${userId}`)
      return []
    }

    return filteredFiles
  } catch (error) {
    console.error('Error retrieving files:', error)
    return []
  }
}

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

const getGameImages = async (users) => {
  try {
    const usersArray = Object.values(users)

    // List all files in the specified bucket
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('public/', { limit: 1000 })

    if (listError) throw listError

    const gameList = files
      .map((file) => {
        const player = usersArray.find((user) => user.id == file.name.split(':')[0])

        return player
          ? {
              ...player,
              file: {
                id: file.id,
                url: `${supabaseUrl}/storage/v1/object/images/public/${file.name}`
              }
            }
          : null
      })
      .filter((item) => item !== null) // Filter out null entries

    return shuffleArray(gameList)
  } catch (error) {
    console.error('Error retrieving files:', error)
    return []
  }
}

// Create a Supabase object to encapsulate the methods
const SUPERBASE = {
  uploadToSupabase,
  deleteAllFilesFromSupabase,
  getFilesStartingWith,
  getGameImages
}

module.exports = SUPERBASE
