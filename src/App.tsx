import BookData from './api/books.json'
import { useState, useEffect } from 'react'
import DeleteIcon from './icons/DeleteIcon'
function App() {
  type Book = {
    book: {
      title: string
      pages: number
      genre: string
      cover: string
      synopsis: string
      year: number
      ISBN: string
      author: {
        name: string
        otherBooks: string[]
      }
    }
  }
  const arr: Book[] = []
  const [books, setBooks] = useState<Array<Book>>(BookData.library)
  const [readingList, setReadingList] = useState<Array<Book>>(arr)

  const extratedGenres = books.map(function (book) {
    return book.book['genre']
  })

  const bookGenres = [...new Set(extratedGenres)]

  useEffect(() => {
    const getReadingList = window.localStorage.getItem('readinglist')
    const getBookList = window.localStorage.getItem('books')
    if (getReadingList != null && getBookList != null) {
      setReadingList(JSON.parse(getReadingList))
      setBooks(JSON.parse(getBookList))
    } else {
      null
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('books', JSON.stringify(books))
    window.localStorage.setItem('readinglist', JSON.stringify(readingList))
  }, [books, readingList])
  const handleRemoveFilters = () => {
    const filteredISBNs = readingList.map((book) => book.book.ISBN)
    const filterByISBN = BookData.library.filter((book) => {
      return !filteredISBNs.includes(book.book.ISBN)
    })
    setBooks(filterByISBN)
  }
  return (
    <div className="h-screen bg-slate-100 overflow-hidden">
      <header className="container mx-auto text-center m-0">
        <h1 className="text-3xl leading-[80px] font-[Lumanosimo]">
          Library D. Books
        </h1>
      </header>
      <nav className="container mx-auto mb-1 mt-0">
        <ul className="flex gap-4 p-2">
          <li
            onClick={() => {
              handleRemoveFilters()
            }}
          >
            Remove Filters
          </li>
          {bookGenres.map((genre) => (
            <li
              className="font-semibold cursor-pointer"
              key={genre}
              value={genre}
              onClick={() => {
                const booksByGenre = books.filter(
                  (book) => book.book.genre == genre
                )
                setBooks(booksByGenre)
              }}
            >
              {genre}
            </li>
          ))}
        </ul>
      </nav>
      <main className="container mx-auto border-4 border-black flex h-[850px] overflow-hidden">
        <section className="flex justify-center flex-wrap p-4 items-center gap-5 w-11/12 overflow-hidden overflow-y-scroll">
          {books.map((book) => (
            <div
              key={book.book.ISBN}
              className="h-[400px] cursor-pointer overflow-hidden w-[250px] flex flex-col"
              onClick={() => {
                const filterByISBN = readingList.filter(
                  (reading) => reading.book.ISBN === book.book.ISBN
                )
                if (filterByISBN.length == 0) {
                  setReadingList([...readingList, book])
                  const index = books.indexOf(book)
                  books.splice(index, 1)
                } else {
                }
              }}
            >
              <section className="overflow-hidden h-6/7">
                <img
                  srcSet={book.book.cover}
                  className="h-full w-full object-fill"
                  alt=""
                />
              </section>
              <section>
                <div className="text-center pt-2 bg-slate-300 pb-2">
                  <h1 className="font-[EB Garamond] font-semibold">
                    {book.book.title}
                  </h1>
                </div>
              </section>
            </div>
          ))}
        </section>
        <aside className="w-2/6 bg-orange-300 overflow-scroll">
          <header text-center>
            <h1 className="text-center">Reading List:</h1>
          </header>
          {readingList.length > 0 && (
            <section className="flex flex-col gap-3 p-2">
              {readingList.map((reading) => (
                <div
                  key={reading.book.ISBN}
                  className="flex justify-between bg-gray-400 h-24 overflow-hidden"
                >
                  <section className="h-full w-3/5 overflow-hidden">
                    <img
                      srcSet={reading.book.cover}
                      className="w-full h-full"
                      alt=""
                    />
                  </section>
                  <section className="w-full">
                    <h2 className="px-2 pt-9">{reading.book.title}</h2>
                  </section>
                  <section className="pr-2 pt-2">
                    <span
                      className="text-red cursor-pointer"
                      onClick={() => {
                        setBooks([...books, reading])
                        const index = readingList.indexOf(reading)
                        readingList.splice(index, 1)
                      }}
                    >
                      <DeleteIcon />
                    </span>
                  </section>
                </div>
              ))}
            </section>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
