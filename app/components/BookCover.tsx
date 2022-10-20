import { type Book } from "~/util";

export default function BookCover({ book }: { book: Book }) {
  return book?.image ? (
    <img
      src={book?.image}
      alt={book?.title}
      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
    />
  ) : (
    <div className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32 bg-gray-400">
      No preview
    </div>
  );
}
