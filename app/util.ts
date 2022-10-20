export const googleBookUrl = (isbn: string) =>
  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

/**
 * doc: https://openlibrary.org/dev/docs/api/books
 * @param isbn
 * @returns
 */
export const openlibraryBookUrl = (isbn: string) =>
  `https://openlibrary.org/isbn/${isbn}.json`;

export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string;
  serie: string;
  description: string;
  image: string;
  categories: string;
  publisher: string;
  publishedDate: string;
  pageCount: number;
  language: string;
}

export const getBook = async (
  isbn: string,
  init?: RequestInit
): Promise<Omit<Book, "id"> | null> => {
  if (!isbn) {
    return null;
  }
  // get the book from the google books api
  const gbooks = await fetch(googleBookUrl(isbn), init)
    .then((res) => res.json())
    .catch((err) => null);
  const gbook = gbooks?.items?.[0]?.volumeInfo || null;

  const openbook = await fetch(openlibraryBookUrl(isbn), init)
    .then((res) => res.json())
    .catch((err) => null);

  if (!gbook && !openbook) {
    return null;
  }
  return {
    isbn: isbn,
    title:
      gbook?.title ||
      [openbook?.title, openbook?.subtitle].filter((o) => o).join(", "),
    description:
      gbook?.description ||
      openbook?.first_sentence?.value ||
      gbook?.searchInfo?.textSnippet,
    image:
      gbook?.imageLinks?.thumbnail ||
      (openbook?.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${openbook?.covers[0]}-M.jpg`
        : null),
    authors: gbook?.authors?.join(", "),
    serie: openbook?.series?.[0]?.replace(/\(\d+\)/, "").trim(),
    categories:
      gbook?.categories?.join(", ") ||
      openbook?.genres?.join(", ") ||
      openbook?.subjects?.join(", "),
    publisher: gbook?.publisher || openbook?.publishers?.join(", "),
    publishedDate: gbook?.publishedDate || openbook?.publish_date,
    pageCount: gbook?.pageCount || openbook?.number_of_pages,
    language: gbook?.language,
  };
};
