import Airtable from "airtable";

import { type Book } from "~/util";

function getAirTableBase() {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
  // to get the base ID,visit https://airtable.com/api
  return airtable.base(process.env.AIRTABLE_BASE_ID!);
}

function getAirTableBookTable() {
  const base = getAirTableBase();
  return base("Books");
}

export async function getBooks() {
  const base = getAirTableBookTable();
  return (await base.select({ maxRecords: 1000 }).all()).reduce(
    (acc: Book[], o: any) => {
      const book = {
        id: o.id,
        isbn: o.get("isbn"),
        serie: o.get("serie"),
        title: o.get("title"),
        description: o.get("description"),
        authors: o.get("authors"),
        image: o.get("image"),
        categories: o.get("categories"),
        publisher: o.get("publisher"),
        publishedDate: o.get("publishedDate"),
        pageCount: o.get("pageCount"),
        language: o.get("language"),
      };
      if (book.isbn || book.title) {
        acc.push(book);
      }
      return acc;
    },
    []
  );
}

export async function addBook(book: Omit<Book, "id">) {
  const base = getAirTableBookTable();

  return base.create(book);
}

