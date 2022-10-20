import { Link } from "@remix-run/react";

import { type Book } from "~/util";
import BookCover from "./BookCover";

export default function BookList({
  items,
  className,
}: {
  className?: string;
  items: Book[];
}) {
  return (
    <ul
      className={`divide-y divide-gray-200 border-t border-b border-gray-200 ${className}`}
    >
      {items.map((book, idx) => (
        <li className="flex py-6" key={book.id || book.isbn}>
          <div className="flex-shrink-0">
            <BookCover book={book} />
          </div>

          <div className="ml-4 flex flex-1 flex-col sm:ml-6">
            <div>
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                  {book.title
                    ? [book.serie, book.title].filter((o) => o).join(" / ")
                    : "Not found"}
                </h4>
                <div>
                  <p className="ml-4 text-sm  text-gray-500">#{idx + 1}</p>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">{book?.authors}</p>
              <p className="mt-1 text-sm text-gray-500">
                {[book.publishedDate, book.publisher]
                  .filter((o) => o)
                  .join(", ")}
              </p>
              <p className="mt-1 text-sm text-gray-500">{book?.categories}</p>
              <Link
                className="mt-1 text-sm text-gray-500"
                to={`/books/${book.isbn}`}
              >
                ISBN {book.isbn}
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
