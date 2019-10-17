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

function getData(){
    fetch(mainUrl + 'books')
    .then(res => res.json())
    .then(booksData => {
        allBooks = booksData
        makeBookList(allBooks)
    })
}

function clearNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

function newElement({ type, classes, textContent, parentElement, id, innerHTML, innerText, clearParent, source  }) {
    let element = document.createElement(type)
    if (type === 'img' && source)
        element.src = source
    if (classes && typeof classes === 'string')
    element.classList += classes
    if (classes && typeof classes === 'object')
        classes.forEach( cls => {
            element.classList += cls
        })
    if (textContent)
    element.textContent = textContent
    if (id)
    element.id = id
    if (parentElement)
        if (clearParent)
            clearNode(parentElement)
        parentElement.appendChild(element)
    if (innerHTML)
    element.innerHTML = innerHTML
    if (innerText)
    element.innerText = innerText
    return element
}

function makeBookList(books) {
    let listName = newElement({
        type: 'h4',
        classes: 'ui centered header',
        textContent: 'Book List',
        parentElement: listDiv,
        clearParent: true,
        id: 'list-name'
    })

    books.forEach(book => {
        let itemDiv = newElement({
            type: 'div',
            classes: 'item',
            id: book.id,
            parentElement: listDiv
        })
        itemDiv.addEventListener('click', (e)=> {
            displayBook(book)
        })

        let icon = newElement({
            type: 'i',
            classes: 'book icon',
            parentElement: itemDiv
        })
        
        let content = newElement({
            type: 'div',
            classes: 'content',
            textContent: book.title,
            parentElement: itemDiv
        })
    })
}

function displayBook(book) {
    let segment = newElement({
        type: 'div',
        classes: 'ui raised segment container',
        parentElement: showPanel,
        clearParent: true
    })
    segment.style.height = '100vh'

    let title = newElement({
        type: 'h1',
        classes: 'ui centered header',
        textContent: book.title,
        parentElement: segment
    })

    let image = newElement({
        type: 'img',
        source: book.img_url,
        classes: 'ui rounded small centered image',
        parentElement: segment
    })

    let br = newElement({
        type: 'br',
        parentElement: segment
    })

    let description = newElement({
        type: 'p',
        textContent: book.description,
        parentElement: segment
    })

    let likeBtn = newElement({
        type: 'button',
        classes: 'ui negative basic button',
        parentElement: segment
    })
    if (checkIfUserLiked(book))
        likeBtn.textContent = `Liked! ${FULL_HEART}`
    else
        likeBtn.textContent = `Like ${EMPTY_HEART}`
    likeBtn.addEventListener('click', (e)=> toggleLike(book))

    let br2 = newElement({
        type: 'br',
        parentElement: segment
    })
    let br3 = newElement({
        type: 'br',
        parentElement: segment
    })

    let listName = newElement({
        type: 'div',
        classes: 'header',
        innerHTML: '<u>Users who have like this book:</u>',
        parentElement: segment
    })
    
    let userList = newElement({
        type: 'div',
        classes: 'ui list',
        parentElement: segment
    })

    book.users.map( user => {
        let itemDiv = newElement({
            type: 'div',
            classes: 'item',
            parentElement: userList
        })
        
        let icon = newElement({
            type: 'i',
            classes: 'user icon',
            parentElement: itemDiv
        })

        let content = newElement({
            type: 'div',
            classes: 'content',
            textContent: user.username,
            parentElement: itemDiv
        })
    })
}

function checkIfUserLiked(book){
    let liked = false
    book.users.map( user => {
        if (user.id === 1)
            liked = true
    })
    return liked
}

function toggleLike(book){
    if (checkIfUserLiked(book)){
        let users = book.users.filter( user => {
            if (user.id !== 1)
                return user
        })
        book.users = users
    } else {
        book.users.push({ id: 1, username: 'pouros' })
    }
    fetch(mainUrl + `books/${book.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            users: book.users
        })
    })
    .then(res => res.json())
    .then(bookData => {
        allBooks = allBooks.map( book => {
            if (book.id === bookData.id)
                return bookData
            else
                return book
        })
        displayBook(bookData)
    })
    .catch(errors => console.log(errors))
}

getData()