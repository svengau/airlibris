import { type LoaderFunction } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
