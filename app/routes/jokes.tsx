import { Joke } from "@prisma/client";
import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet, Link } from "remix";
import { db } from "~/utils/db.server";
import stylesUrl from "../styles/jokes.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export let loader: LoaderFunction = async () => {
  let jokeListItems = await db.joke.findMany({
    select: { id: true, name: true },
    take: 7,
    orderBy: { createdAt: "desc" },
  });
  let data: LoaderData = { jokeListItems };
  return data;
};

type LoaderData = { jokeListItems: Array<Pick<Joke, "id" | "name">> };

export default function JokesRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
