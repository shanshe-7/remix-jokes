import React from "react";

function NewJokesRoute() {
  return (
    <div>
      <p>add own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            add
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJokesRoute;
