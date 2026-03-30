import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SubmitBarProps {
  onSubmit: (query: string) => void;
}

const SearchBar = ({ onSubmit }: SubmitBarProps) => {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form
          className={css.form}
          action={async (formData: FormData) => {
            const value = formData.get("query");
            const query = (value ? String(value) : "").trim();
            if (!query) {
              toast.error("Please enter your search query.");
              return;
            }
            onSubmit(query);
          }}
        >
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;