import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import ReactPaginateImport from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";

const ReactPaginate =
  (ReactPaginateImport as unknown as { default?: typeof ReactPaginateImport })
    .default ?? ReactPaginateImport;

const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isLoading && !isError && data?.results.length === 0 && query) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, isError, query]);

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} /> 
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }: { selected: number }) =>
                setPage(selected + 1)
              }
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default App;