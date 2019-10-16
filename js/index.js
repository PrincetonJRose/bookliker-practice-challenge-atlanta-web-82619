const bookList = document.getElementById('list')
const listDiv = document.createElement('div')
listDiv.classList += 'ui animated divided list'
const listPanel = document.getElementById('list-panel')
listPanel.appendChild(listDiv)
const showPanel = document.getElementById('show-panel')
showPanel.style.overflowY = 'auto'
showPanel.style.height = '100vh'

const mainUrl = 'http://localhost:3000/'

const EMPTY_HEART = '♡'
const FULL_HEART = '♥'

let allBooks
let users

function getData(){
    fetch(mainUrl + 'books')
    .then(res => res.json())
    .then(booksData => {
        allBooks = booksData
        makeBookList(allBooks)
    })

    fetch(mainUrl + 'users')
    .then(res => res.json())
    .then(usersData => {
        users = usersData
    })
}

function clearNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

function makeBookList(books) {
    let listName = document.createElement('h4')
    listName.classList += 'ui centered header'
    listName.textContent = 'Book List'
    listDiv.appendChild(listName)

    books.forEach(book => {
        let itemDiv = document.createElement('div')
        itemDiv.classList += 'item'
        itemDiv.dataset.bookId = book.id
        itemDiv.addEventListener('click', (e)=> {
            displayBook(book)
        })

        let icon = document.createElement('i')
        icon.classList += 'book icon'
        itemDiv.appendChild(icon)
        
        let content = document.createElement('div')
        content.classList += 'content'
        content.textContent = book.title
        itemDiv.appendChild(content)

        listDiv.appendChild(itemDiv)

    })
}

function displayBook(book) {
    clearNode(showPanel)
    let segment = document.createElement('div')
    segment.classList += 'ui raised segment container'
    segment.style.height = '100vh'

    let title = document.createElement('h1')
    title.classList += 'ui centered header'
    title.textContent = book.title

    let image = document.createElement('img')
    image.classList += 'ui rounded small centered image'
    image.src = book.img_url

    let description = document.createElement('p')
    description.textContent = book.description

    let listName = document.createElement('div')
    listName.classList += 'header'
    listName.innerHTML = '<u>Users who have like this book:</u>'
    
    let userList = document.createElement('div')
    userList.classList += 'ui list'
    book.users.map( user => {
        let itemDiv = document.createElement('div')
        itemDiv.classList += 'item'
        userList.appendChild(itemDiv)
        
        let icon = document.createElement('i')
        icon.classList += 'user icon'
        itemDiv.appendChild(icon)
        
        let content = document.createElement('div')
        content.classList += 'content'
        content.textContent = user.username
        itemDiv.appendChild(content)
        
    })
    
    let br = document.createElement('br')
    let br2 = document.createElement('br')
    let br3 = document.createElement('br')
    
    segment.appendChild(title)
    segment.appendChild(image)
    segment.appendChild(br)
    segment.appendChild(description)
    segment.appendChild(br2)
    segment.appendChild(br3)-
    segment.appendChild(listName)
    segment.appendChild(userList)

    showPanel.appendChild(segment)

}

getData()