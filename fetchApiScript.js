var list = document.querySelector('ul')
var input = document.querySelector('input')
var button = document.querySelector('button')

window.onload = async function () {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await res.json()
  // data = data.map(todo => todo.title)

  console.log(data)
  for (item of data) {
  	console.log(item.userId)
  	if (item.userId == 1) {
  		const listItem = document.createElement('li')
	    const checkboxItem = document.createElement('INPUT')
	  	checkboxItem.setAttribute('type', 'checkbox')
	  	const itemContent = document.createElement('label')
	  	const listBtn = document.createElement('button')
	  	listBtn.textContent = 'Delete'
	  	listItem.appendChild(checkboxItem)
	  	listItem.appendChild(itemContent)
	  	listItem.appendChild(listBtn)
	  	list.appendChild(listItem)

	  	itemContent.innerHTML = item.title
	  	if (item.completed) {
	  		checkboxItem.checked = true
        	itemContent.setAttribute('style', 'text-decoration: line-through;')
	  	}
  	}
  }
}
