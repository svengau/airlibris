import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return {
    title: "Login",
    description: "Login to your account",
  };
};

export default function Login() {
  return (
    <>
      <Form
        action="/auth/google"
        method="post"
        className="flex flex-col w-full justify-center"
      >
        <div className="m-auto flex flex-col items-center gap-10">
          <h1 className="text-blue-400 font-light text-3xl">Airlibris</h1>
          <button className=" button">Login with Google</button>
        </div>
      </Form>
    </>
  );
}
