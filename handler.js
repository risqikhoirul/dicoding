const { nanoid } = require("nanoid");
const books = require("./books");
const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const updatedAt = new Date().toISOString();
  const finished = reading;
  const insertedAt = updatedAt;

  const newBooks = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBooks);
  //Validasi buku seperti memastikan buku mempunyai nama atau page read tidak melebihi page count, seharusnya dilakukan terlebih dahulu sebelum buku dimasukkan ke dalam array.

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};
const getAllBooksHandler = (request, h) => {
  //Response yang muncul seharusnya seperti ini, hanya memiliki properti id, name, dan publisher
  const { name, reading, finished } = request.query;
  if (!name && !reading && !finished) {
    const response = h.response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  //
  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  //const insertedAt = updatedAt;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      //Validasi buku seperti memastikan buku mempunyai nama atau page read tidak melebihi page count, seharusnya dilakukan terlebih dahulu sebelum buku dimasukkan ke dalam array.

      ...books[index],

      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
      //Pesan yang muncul pada kode ini masih belum sesuai dengan apa yang sudah ditentukan pada testing.
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
    //Pesan yang muncul pada kode ini masih belum sesuai dengan apa yang sudah ditentukan pada testing.
  });
  response.code(404);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler /*getNamaBookByIdHandler*/ };
