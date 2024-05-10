const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    if (!name) {
        const resp = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        resp.code(400);
        return resp;
    }
    if (readPage > pageCount) {
        const resp = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        resp.code(400);
        return resp;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        "updatedAt" : insertedAt
    };
    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const resp = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        resp.code(201);
        return resp;
    }

    const resp = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan",
    });
    resp.code(500);
    return resp;
};

const getAllBooksHandler = (request) => {

    const { name, reading , finished} = request.query;

    let filteredBooks = books;
    if (name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (finished) {
        const isFinished = (finished === "1");
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }
    if (reading) {
        const isReading = (reading === "1");
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }
    const selectedBooks = filteredBooks.map(book => {
        return {
            id: book.id,
            name: book.name,
            publisher: book.publisher
        };
    });

    return {
        status: "success",
        data: {
            books: selectedBooks
        }
    };
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: "success",
            data: {
                book,
            },
        };
    }
    const resp = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    resp.code(404);
    return resp;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    if (!name) {
        const resp = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        resp.code(400);
        return resp;
    }
    if (readPage > pageCount) {
        const resp = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        resp.code(400);
        return resp;
    }

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        const insertedAt = books[index];
        const finished = pageCount === readPage;

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt
        };
        const resp = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    resp.code(404);
    return resp;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const resp = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    resp.code(404);
    return resp;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
