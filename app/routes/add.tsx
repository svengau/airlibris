import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  type ActionFunction,
  type MetaFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Outlet, useLoaderData, useTransition } from "@remix-run/react";

import { addBook, getBooks } from "~/services/airtable";
import { type Book, getBook } from "~/util";
import Modal from "~/components/Modal";
import BookList from "~/components/BookList";
import useQuagga from "~/components/hooks/useQuagga";

let abortController = new AbortController();

const mappingStatusTolabel = {
  to_add: "Add to library",
  submitting: "Submitting",
  added: "Added",
  already_added: "Add again",
};

export const meta: MetaFunction = () => {
  return {
    title: "Scan ISBN",
    description: "Scan book barcode to add it to your library",
  };
};

export let loader: LoaderFunction = async ({ request }) => {
  const books = (await getBooks()).map((book) => book.isbn);
  return json({ books });
};

// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const isbn = formData.get("isbn") as string;

  const book = await getBook(isbn);

  if (book) {
    await addBook(book);
    return redirect("/add");
  }

  return json({ book });
};

export default function AddBooks() {
  const transition = useTransition();
  const isbnInputRef = useRef<HTMLInputElement>(null);
  const [detectedIsbns, setDetectedIsbns] = useState<string[]>([]);
  const [resolvedIsbns, setResolvedIsbns] = useState<string[]>([]);
  const { books: currentIsbnBooks } = useLoaderData<{ books: string[] }>();
  const [currentBook, setCurrentBook] = useState<Omit<Book, "id">>();
  useQuagga({
    onDetected: (isbn) =>
      setDetectedIsbns((state) => Array.from(new Set([...state, isbn]))),
  });

  const closeModal = () => {
    setDetectedIsbns([]);
    setCurrentBook(undefined);
    abortController = new AbortController();
  };

  const onAddedManually = (e: any) => {
    e.preventDefault();
    setDetectedIsbns([isbnInputRef.current?.value as string]);
  };

  // Retrieve books
  useEffect(() => {
    const isbnToAdd = detectedIsbns[detectedIsbns.length - 1];
    if (!isbnToAdd) {
      return;
    }
    async function retrieveBook() {
      const book = await getBook(isbnToAdd, {
        signal: abortController.signal,
      }).catch((err) => {
        console.error(err);
      });
      if (book) {
        abortController.abort();
        setCurrentBook(book);
        setResolvedIsbns(detectedIsbns);
      } else {
        setTimeout(() => {
          setResolvedIsbns((state) =>
            Array.from(new Set([...state, isbnToAdd]))
          );
        }, 1000);
      }
    }

    retrieveBook();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedIsbns]);

  // handles button state during form submission
  useEffect(() => {
    if (transition.state === "loading") {
      toast("Added!");
      closeModal();
    }
  }, [transition]);

  let status: keyof typeof mappingStatusTolabel = "to_add";
  if (transition.state === "submitting") {
    status = "submitting";
  } else if (transition.state === "loading") {
    status = "added";
  } else if (currentBook && currentIsbnBooks.includes(currentBook.isbn)) {
    status = "already_added";
  }
  const lastQueuedIsbn = detectedIsbns[detectedIsbns.length - 1];

  return (
    <div className="flex flex-col w-full ">
      <Outlet />
      <div className="w-full px-4">
        <div className="flex flex-col items-center mb-2 md:mt-4">
          <p>Scan ISBN barcodes</p>
          <div id="interactive" className="viewport"></div>
          <p className="text-sm text-gray-500">
            {lastQueuedIsbn || "waiting scan..."}
          </p>

          <div className="flex justify-between items-center my-3 text-xs text-center text-gray-500 uppercase w-96">
            <span className="w-2/5 border-b"></span>or
            <span className="w-2/5 border-b"></span>
          </div>

          <div className="flex gap-1 flex-col">
            <p>Add manually</p>
            <form className="flex gap-2">
              <input
                type={"text"}
                ref={isbnInputRef}
                name="isbn"
                placeholder="ISBN"
              />
              <button
                onClick={onAddedManually}
                className="button primary"
                type="submit"
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <Modal
          open={!!lastQueuedIsbn}
          onClose={closeModal}
          title={`ISBN ${lastQueuedIsbn}`}
          className="max-w-sm"
        >
          <Form method="post" className="form my-4 flex flex-col">
            {currentBook ? (
              <>
                <BookList items={[currentBook as any]} />
                <button
                  disabled={status === "submitting"}
                  type="submit"
                  name="isbn"
                  value={currentBook.isbn}
                  className="button outlined"
                >
                  <span>{mappingStatusTolabel[status]}</span>
                </button>
              </>
            ) : resolvedIsbns.length === detectedIsbns.length ? (
              "Ooops, nothing found :("
            ) : (
              "Scanning in progress..."
            )}
          </Form>
        </Modal>
      </div>
    </div>
  );
}
