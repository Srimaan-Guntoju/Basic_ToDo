var list = document.querySelector('ul')
var input = document.querySelector('input')
var button = document.querySelector('button')

let db

window.onload = function () {
  // Open our database; it is created if it doesn't already exist
  // (see onupgradeneeded below)
  const request = window.indexedDB.open('notes_db', 1)

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function (e) {
  	console.log(e)
    console.log('Database failed to open')
  }

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function () {
    console.log('Database opened succesfully')

    // Store the opened database object in the db variable. This is used a lot below
    db = request.result

    // Run the displayData() function to display the notes already in the IDB
    displayData()
  }

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function (e) {
    // Grab a reference to the opened database
    const db = e.target.result

    // Create an objectStore to store our notes in (basically like a single table)
    // including a auto-incrementing key
    const objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement: true })

    // Define what data items the objectStore will contain
    objectStore.createIndex('item', 'item', { unique: false })
    objectStore.createIndex('check', 'check', { unique: false })
    console.log('Database setup complete')
  }

  // Create an onsubmit handler so that when the form is submitted the addData() function is run
  button.onclick = addData

  // Define the addData() function
  function addData (e) {
    const newItem = { item: input.value, check: false }
    const transaction = db.transaction(['notes_os'], 'readwrite')
    const objectStore = transaction.objectStore('notes_os')
    var request = objectStore.add(newItem)
    request.onsuccess = function () {
      input.value = ''
    }

    transaction.oncomplete = function () {
      console.log('Transaction completed: database modification finished.')
      displayData()
    }

    transaction.onerror = function () {
      console.log('Transaction not opened due to error')
    }
  }

  // Define the displayData() function
  function displayData () {
    while (list.firstChild) {
      list.removeChild(list.firstChild)
    }
    const objectStore = db.transaction('notes_os').objectStore('notes_os')
    objectStore.openCursor().onsuccess = function (e) {
      // Get a reference to the cursor
      const cursor = e.target.result

      if (cursor) {
        const listItem = document.createElement('li')
	    const checkboxItem = document.createElement('INPUT')
	  	checkboxItem.setAttribute('type', 'checkbox')
	  	const itemContent = document.createElement('label')
	  	const listBtn = document.createElement('button')
	  	listBtn.textContent = 'Delete'
	  	itemContent.innerHTML = cursor.value.item
	  	listItem.appendChild(checkboxItem)
	  	listItem.appendChild(itemContent)
	  	listItem.appendChild(listBtn)
	  	list.appendChild(listItem)

        listItem.setAttribute('data-note-id', cursor.value.id)
        console.log(cursor.value.check)
        if (cursor.value.check == true) {
        	checkboxItem.checked = true
        	itemContent.setAttribute('style', 'text-decoration: line-through;')
        }

        listBtn.onclick = deleteItem
        checkboxItem.onclick = checkItem
        cursor.continue()
      } else {
        if (!list.firstChild) {
          const listItem = document.createElement('li')
          listItem.textContent = 'No notes stored.'
          list.appendChild(listItem)
        }
        console.log('Notes all displayed')
      }
    }
  }

  function checkItem (e) {
    const noteId = Number(e.target.parentNode.getAttribute('data-note-id'))
    const transaction = db.transaction(['notes_os'], 'readwrite')
    const objectStore = transaction.objectStore('notes_os')
    const data = objectStore.get(noteId)
    data.onsuccess = function () {
    	console.log('lolo', data.result)
    	if (e.target.checked == true) {
    		data.result.check = true
    		e.target.parentNode.childNodes[1].setAttribute('style', 'text-decoration: line-through;')
    	} else {
    		data.result.check = false
    		e.target.parentNode.childNodes[1].setAttribute('style', 'text-decoration: none;')
    	}
    	const request = objectStore.put(data.result)
    	request.onsuccess = () => console.log('item checked')
    }
    data.onerror = () => console.log('error occured while checking the item ', noteId)
  }

  // Define the deleteItem() function
  function deleteItem (e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying it use it with IDB; IDB key
    // values are type-sensitive.
    const noteId = Number(e.target.parentNode.getAttribute('data-note-id'))

    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(['notes_os'], 'readwrite')
    const objectStore = transaction.objectStore('notes_os')
    const request = objectStore.delete(noteId)

    // report that the data item has been deleted
    transaction.oncomplete = function () {
      // delete the parent of the button
      // which is the list item, so it is no longer displayed
      e.target.parentNode.parentNode.removeChild(e.target.parentNode)
      console.log('Note ' + noteId + ' deleted.')

      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const listItem = document.createElement('li')
        listItem.textContent = 'No notes stored.'
        list.appendChild(listItem)
      }
    }
  }
}
