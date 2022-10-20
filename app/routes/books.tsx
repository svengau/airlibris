import { type MetaFunction, type LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import BookList from "~/components/BookList";
import { getBooks } from "~/services/airtable";
import { type Book } from "~/util";

export let loader: LoaderFunction = async ({ request }) => {
  const books = await getBooks();
  return json({ books, AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID });
};

export let meta: MetaFunction = () => {
  return {
    title: "Book collection",
    description: "My Book collection",
  };
};

export default function Books() {
  let data = useLoaderData<{ books: Book[] }>();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1>My books collection</h1>
          <p className="mt-2 text-sm text-gray-700">
            This list is stored in the following{" "}
            <a
              href={`https://airtable.com/${data.AIRTABLE_BASE_ID}`}
              target="_blank"
              rel="noreferrer"
            >
              Airtable
            </a>
            , and can be edited from there.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/add" className="button">
            Scan books
          </Link>
        </div>
      </div>

      <BookList items={data.books} className="mt-8 w-full" />

      <Outlet />
    </div>
  );
}
