import { json, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import Modal from "~/components/Modal";
import { googleBookUrl, openlibraryBookUrl } from "~/util";

export const loader: LoaderFunction = async ({ params }: any) => {
  const { isbn } = params;
  return json({ isbn });
};

export default function BookLinks() {
  const navigate = useNavigate();
  const { isbn } = useLoaderData();

  const closeModal = () => navigate("/books");

  return (
    <Modal
      open
      onClose={closeModal}
      title={`ISBN ${isbn}`}
      className="max-w-sm"
    >
      <Form method="post" className="form my-4 flex flex-col">
        <a
          href={googleBookUrl(isbn)}
          rel="noreferrer"
          target="_blank"
          className="button outlined"
        >
          googlebook
        </a>
        <a
          href={openlibraryBookUrl(isbn)}
          rel="noreferrer"
          target="_blank"
          className="button outlined"
        >
          openlibrary
        </a>
      </Form>
    </Modal>
  );
}
