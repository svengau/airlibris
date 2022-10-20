import { useState } from "react";
import {
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ToastContainer } from "react-toastify";
import ReactToastifyCSS from "react-toastify/ReactToastify.min.css";

import styles from "~/styles/app.css";
import Sidebar from "./components/Sidebar";
import { authenticator } from "./services/auth.server";
import Logo from "./components/Logo";

function throwIf(condition: boolean, message: string, httpStatusCode: number) {
  if (condition) {
    throw new Response(message, { status: httpStatusCode });
  }
}

// https://remix.run/api/conventions#links
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: ReactToastifyCSS },
  ];
};

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const isPublicUrl = ["/login", "/logout"].includes(url.pathname);

  let user = await authenticator.isAuthenticated(request);

  if (!user && !isPublicUrl) {
    return redirect("/login");
  }

  // check config
  [
    "AIRTABLE_API_KEY",
    "AIRTABLE_BASE_ID",
    "GOOGLE_AUTH_CLIENT_ID",
    "GOOGLE_AUTH_CLIENT_SECRET",
    "ADMIN_EMAIL",
    "SESSION_SECRET",
    "SERVICE_URL",
  ].forEach((envVar) =>
    throwIf(!process.env[envVar], `Env var ${envVar} is not defined`, 503)
  );

  // check authorization
  throwIf(
    !isPublicUrl &&
      process.env.ADMIN_EMAIL !== "any" &&
      user?.email !== process.env.ADMIN_EMAIL,
    "User not authorized",
    401
  );

  return {
    user,
  };
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user } = useLoaderData<{ user: any | undefined }>();

  return (
    <Document>
      <Layout user={user}>
        <Outlet />
        <ToastContainer position="bottom-right" />
      </Layout>
    </Document>
  );
}

// https://remix.run/api/conventions#errorboundary
export function ErrorBoundary({ error, ...rest }: { error: Error }) {
  console.error({ error });
  return (
    <Document title="Error!">
      <Layout user={null}>
        <div className="flex flex-col w-full justify-center">
          <div className="m-auto">
            <h1>There was an error</h1>
            <p>{error.message}</p>
          </div>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();
  console.log(caught);
  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;
    case 503:
      message = <p>Oops! Looks like the server is not well configured.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout user={null}>
        <div className="flex flex-col w-full justify-center">
          <div className="m-auto flex gap-2 flex-col">
            <h1>
              Error {caught.status}: {caught.data}
            </h1>
            <p>{message}</p>
          </div>
        </div>
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html className="h-full bg-white" lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ user, children }: { user: any; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full">
      {user && (
        <Sidebar
          open={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
            <Link to="/">
              <Logo />
            </Link>
            <div>
              <button
                type="button"
                className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative z-0 flex flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
