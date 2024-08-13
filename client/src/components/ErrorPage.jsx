import { useRouteError } from "react-router-dom";
import Navbar from "./Navbar";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <Navbar />
      <h1 className="text-primary text-6xl text-center pt-32">Oops!</h1>
      <p className="text-xl text-center pt-3">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-600 text-center pt-1">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}