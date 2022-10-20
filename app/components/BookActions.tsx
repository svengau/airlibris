import { type Book } from "~/util";

export interface BookActionsProps {
  action: "add" | "view";
  className?: string;
  book: Book;
}

export default function BookActions({
  book,
  className,
  action,
}: BookActionsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {action === "add" ? (
        <button
          disabled={book.status === "submitting"}
          type="submit"
          name="isbn"
          value={book.isbn}
          className="button outlined"
        >
          <span>
            {book.status === "added"
              ? "Added"
              : book.status === "already_added"
              ? "Add again"
              : "Add"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
