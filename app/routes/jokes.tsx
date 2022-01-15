import { Outlet } from "remix";

const jokes = () => {
  return (
    <div>
      <h1>J😂kes</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default jokes;
