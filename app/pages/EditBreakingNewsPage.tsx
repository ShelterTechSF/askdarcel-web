import React, { useState, useEffect } from "react";
import { RiAddBoxLine, RiDeleteBin5Line, RiSave3Line } from "react-icons/ri";

import { NewsArticle } from "models";
import * as dataService from "../utils/DataService";
import "./EditBreakingNewsPage.scss";

export const EditBreakingNewsPage = () => {
  const [breakingNewsArticles, setBreakingNewsArticles] = useState<
    Array<NewsArticle>
  >([]);
  useEffect(() => {
    dataService.get("/api/news_articles").then(({ news_articles }) => {
      setBreakingNewsArticles(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        news_articles.map((article: NewsArticle) => ({
          ...article,
          effective_date: article.effective_date
            ? formatDate(article.effective_date)
            : "",
          expiration_date: article.expiration_date
            ? formatDate(article.expiration_date)
            : "",
        }))
      );
    });
  }, []);

  // eslint-disable-next-line arrow-body-style
  const formatDate = (date: string): string | null => {
    return date ? new Date(date).toISOString().split("T")[0] : null;
  };

  const onAddNew = () => {
    setBreakingNewsArticles([
      ...breakingNewsArticles,
      {
        id: "",
        body: "",
        effective_date: "",
        expiration_date: "",
        headline: "",
        priority: null,
        url: "",
      },
    ]);
  };

  const onSave = (articleId: string) => {
    const article = breakingNewsArticles.find(
      ({ id }: any) => id === articleId
    );
    const route = `/api/news_articles/${articleId ?? ""}`;

    if (articleId) {
      dataService.put(route, article);
    } else {
      dataService.post(route, article);
    }
  };

  const onDelete = (articleId: string, index: number) => {
    const updatedBreakingNewsArticles = [...breakingNewsArticles];
    updatedBreakingNewsArticles.splice(index, 1);

    if (articleId) {
      dataService.APIDelete(`/api/news_articles/${articleId}`);
      // Todo: Add a catch here; if this fails, front-end state will be out of sync with the actual data
    }

    setBreakingNewsArticles(updatedBreakingNewsArticles);
  };

  const onFieldChange = (articleId: string, { target }: any) => {
    const { value, dataset } = target;
    const { field } = dataset;

    setBreakingNewsArticles(
      breakingNewsArticles.map((article: any) => {
        if (article.id === articleId) {
          return {
            ...article,
            [field]: value,
          };
        }
        return article;
      })
    );
  };

  const renderForm = (article: NewsArticle, index: number): any => (
    <form className="form" key={article.id}>
      <div className="form-header">
        <h2>{`Breaking News Article #${index + 1}`}</h2>
        <button type="button" onClick={() => onSave(article.id)}>
          <RiSave3Line />
          Save
        </button>
        <button type="button" onClick={() => onDelete(article.id, index)}>
          <RiDeleteBin5Line />
          Delete
        </button>
      </div>
      <label>
        Headline
        <input
          type="text"
          placeholder="Headline"
          data-field="headline"
          defaultValue={article.headline ?? ""}
          onChange={(e) => onFieldChange(article.id, e)}
        />
      </label>
      <div className="form-section">
        <label>
          Priority (optional)
          <input
            type="number"
            placeholder="Priority"
            data-field="priority"
            defaultValue={article.priority ?? ""}
            onChange={(e) => onFieldChange(article.id, e)}
          />
        </label>
        <label>
          Effective Date
          <input
            type="date"
            data-field="effective_date"
            defaultValue={article.effective_date ?? ""}
            onChange={(e) => onFieldChange(article.id, e)}
          />
        </label>
        <label>
          Expiration Date
          <input
            type="date"
            data-field="expiration_date"
            defaultValue={article.expiration_date ?? ""}
            onChange={(e) => onFieldChange(article.id, e)}
          />
        </label>
      </div>
      <label>
        Body
        <textarea
          placeholder="Body"
          data-field="body"
          defaultValue={article.body ?? ""}
          onChange={(e) => onFieldChange(article.id, e)}
          maxLength={250}
        />
      </label>
      <label>
        URL (optional)
        <p className="labelSubtext">
          Add an optional URL where the user can read more about the breaking
          news
        </p>
        <input
          type="text"
          placeholder="https://www.readmore.com"
          data-field="url"
          defaultValue={article.url ?? ""}
          onChange={(e) => onFieldChange(article.id, e)}
        />
      </label>
    </form>
  );

  return (
    <div className="edit-breaking-news-page">
      <h1 className="breaking-news-header">Edit Breaking News Articles</h1>
      <div>
        {breakingNewsArticles.map((article: any, index: number) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          renderForm(article, index)
        )}
      </div>
      <div className="breaking-news-footer">
        <button type="button" onClick={onAddNew}>
          <RiAddBoxLine />
          Add Breaking News Article
        </button>
      </div>
    </div>
  );
};
