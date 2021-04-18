import React, { Fragment, useEffect, useRef, useState } from "react";
import { useFlexSearch } from "react-use-flexsearch";
import { graphql, Link, useStaticQuery } from "gatsby";

const Search = (props) => {
  const [query, setQuery] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const { localSearchPages } = useStaticQuery(graphql`
    {
      localSearchPages {
        index
        store
      }
    }
  `);

  const { index, store } = localSearchPages;

  const results = useFlexSearch(query, index, store);

  const renderResult = (item) => (
    <article key={item.id} className="m-result">
      <Link
        to={`/blog${item.path}`}
        onClick={props.onClose}
        className="m-result__link"
      >
        <h3 className="m-result__title">{item.title}</h3>
        <span className="m-result__date">{item.published_at}</span>
      </Link>
    </article>
  );

  return (
    <div
      className="m-search js-search opened"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        className="m-icon-button outlined as-close-search js-close-search"
        aria-label="Close search"
        onClick={props.onClose}
      >
        <span className="icon-close" aria-hidden="true"></span>
      </button>
      <div className="m-search__content">
        <form className="m-search__form">
          <div className="pos-relative">
            <span
              className="icon-search m-search-icon"
              aria-hidden="true"
            ></span>
            <label htmlFor="search-input" className="sr-only">
              Type to search
            </label>
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="m-input in-search js-input-search"
              placeholder="Type to search"
            />
          </div>
        </form>
        {query ? (
          <Fragment>
            {results.length > 0 ? (
              <div className="js-search-results">
                {results.map(renderResult)}
              </div>
            ) : (
              <p className="m-not-found align-center js-no-results">
                No results for your search, try something different.
              </p>
            )}
          </Fragment>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
