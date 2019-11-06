var list = document.querySelector('ul')
var input = document.querySelector('input')
var button = document.querySelector('button')
button.onclick = function () {
    	const txt = input.value
    	input.value = ''
    	console.log(txt)
    	const listItem = document.createElement('li')
    	const checkboxItem = document.createElement('INPUT')
  checkboxItem.setAttribute('type', 'checkbox')
  const itemContent = document.createElement('label')
  const listBtn = document.createElement('button')
  listBtn.textContent = 'Delete'
  itemContent.innerHTML = txt
  listItem.appendChild(checkboxItem)
  listItem.appendChild(itemContent)
  listItem.appendChild(listBtn)
  list.appendChild(listItem)
  checkboxItem.onclick = function () {
    if (checkboxItem.checked == true) {
      itemContent.setAttribute('style', 'text-decoration: line-through;')
    } else {
      itemContent.setAttribute('style', 'text-decoration: none;')
    }
  }
  listBtn.onclick = function (e) {
    list.removeChild(listItem)
  }
}

input.focus()
