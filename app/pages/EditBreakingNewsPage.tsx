import React, { useState, useEffect } from 'react';
import { RiAddBoxLine, RiDeleteBin5Line, RiSave3Line } from 'react-icons/ri';

import * as dataService from '../utils/DataService';
import { NewsArticle } from 'models';
import './EditBreakingNewsPage.scss';

export const EditBreakingNewsPage = () => {
  const [breakingNewsArticles, setBreakingNewsArticles] = useState<Array<NewsArticle>>([]);
  useEffect(() => {
    dataService.get('/api/news_articles').then(({ news_articles }) => {
      console.log('news_articles', news_articles);
      setBreakingNewsArticles(news_articles.map((article: NewsArticle) => ({
        ...article,
        effective_date: formatDate(article.effective_date),
        expiration_date: formatDate(article.expiration_date)
      })));
    })
  }, []);

  const formatDate = (date: string): string | null => {
    return date ? new Date(date).toISOString().split('T')[0] : null;
  }

  const onAddNew = async () => {
    const response = await dataService.post('/api/news_articles', {
      effective_date: new Date().toISOString().split('T')[0]
    });
    const { news_article } = await response.json();
    console.log(news_article);

    setBreakingNewsArticles([
      ...breakingNewsArticles,
      {
        ...news_article,
        effective_date: formatDate(news_article.effective_date),
        expiration_date: formatDate(news_article.expiration_date)
      }
    ]);
  }

  const onSave = (articleId: number) => {
    const article = breakingNewsArticles.find(({ id }: any) => id === articleId);
    console.log(article);
    dataService.put(`/api/news_articles/${articleId}`, article);
  };

  const onDelete = async (articleId: number) => {
    await dataService.APIDelete(`/api/news_articles/${articleId}`);
    const updatedNewsArticles = breakingNewsArticles.filter(({ id }: any) => id !== articleId);
    console.log(updatedNewsArticles);

    setBreakingNewsArticles(updatedNewsArticles);
  };

  const onFieldChange = (articleId: number, { target }: any) => {
    const { value, dataset } = target;
    const { field } = dataset;

    setBreakingNewsArticles(breakingNewsArticles.map((article: any) => {
      if (article.id === articleId) {
        return {
          ...article,
          [field]: value
        };
      }
      return article;
    }));
  }

  const renderForm = (article: NewsArticle, index: number): any => (
    <form className="form" key={article.id}>
      <div className="form-header">
        <h2>{`Breaking News Article #${index + 1}`}</h2>
        <button type="button" onClick={() => onSave(article.id)}>
          <RiSave3Line />
          Save
        </button>
        <button type="button" onClick={() => onDelete(article.id)}>
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
          defaultValue={article.headline}
          onChange={e => onFieldChange(article.id, e)}
        />
      </label>
      <div className="form-section">
        <label>
          Priority
          <input
            type="number"
            placeholder="Priority"
            data-field="priority"
            defaultValue={article.priority}
            onChange={e => onFieldChange(article.id, e)}
          />
        </label>
        <label>
          Effective Date
          <input
            type="date"
            data-field="effective_date"
            defaultValue={article.effective_date}
            onChange={e => onFieldChange(article.id, e)}
          />
        </label>
        <label>
          Expiration Date
          <input
            type="date"
            data-field="expiration_date"
            defaultValue={article.expiration_date}
            onChange={e => onFieldChange(article.id, e)}
          />
        </label>
      </div>
      <label>
        Body
        <textarea
          placeholder="Body"
          data-field="body"
          defaultValue={article.body}
          onChange={e => onFieldChange(article.id, e)}
        />
      </label>
    </form>
  );

  return (
    <div className="edit-breaking-news-page">
      <h1 className="breaking-news-header">
        Edit Breaking News Articles
      </h1>
      <div>
        {breakingNewsArticles.map((article: any, index: number) => renderForm(article, index))}
      </div>
      <div className="breaking-news-footer">
        <button type="button"onClick={onAddNew}>
          <RiAddBoxLine />
          Add Breaking News Article
        </button>
      </div>
    </div>
  );
}


