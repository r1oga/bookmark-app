const [
  modal,
  modalShow,
  modalClose,
  bookmarkForm,
  websiteNameEl,
  websiteUrlEl,
  bookmarksContainer
] = [
  'modal',
  'show-modal',
  'close-modal',
  'bookmark-form',
  'website-name',
  'website-url',
  'bookmarks-container'
].map(el => document.getElementById(el))

let bookmarks = {}

const showModal = () => {
  modal.classList.add('show-modal')
  websiteNameEl.focus()
}

const closeModal = () => modal.classList.remove('show-modal')

modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'))
window.addEventListener('click', e =>
  e.target === modal ? closeModal() : null
)

const validateForm = (name, url) => {
  const rgx = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  )

  if (!name || !url) {
    alert('Please submit values for both fields')
    return false
  }

  if (!url.match(rgx)) {
    alert('Please provide a valid url address')
    return false
  }

  return true
}

const buildBookmarks = () => {
  // remove all bookmarks
  bookmarksContainer.textContent = ''

  Object.values(bookmarks).forEach(({ name, url }) => {
    const item = document.createElement('div')
    item.classList.add('item')

    const closeIcon = document.createElement('i')
    closeIcon.classList.add('fas', 'fa-times')
    closeIcon.setAttribute('title', 'Delete Bookmark')
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

    const linkInfo = document.createElement('div')
    linkInfo.classList.add('name')

    const favicon = document.createElement('img')
    favicon.setAttribute(
      'src',
      `http://www.google.com/s2/favicons?domain=${url}`
    )
    favicon.setAttribute('alt', 'Favicon')

    const link = document.createElement('a')
    link.setAttribute('href', `${url}`)
    link.setAttribute('target', '_blank')
    link.textContent = name

    linkInfo.append(favicon, link)
    item.append(closeIcon, linkInfo)
    bookmarksContainer.appendChild(item)
  })
}

const fetchBookmarks = () => {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    buildBookmarks()
  } else {
    localStorage.setItem('bookmarks', '')
  }
}

const deleteBookmark = url => {
  delete bookmarks[url]

  // update bookmarks in local storage and update DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  fetchBookmarks()
}

const storeBookmark = e => {
  e.preventDefault()
  const name = websiteNameEl.value
  let url = websiteUrlEl.value

  if (!url.includes('http://', 'https://')) {
    url = `https://${url}`
  }

  if (!validateForm(name, url)) {
    return false
  }

  const bookmark = { name, url }
  bookmarks[url] = bookmark
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  bookmarkForm.reset()
  closeModal()
  fetchBookmarks()
}

bookmarkForm.addEventListener('submit', storeBookmark)

fetchBookmarks()
