import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiAddBoxLine, RiDeleteBin5Line, RiSave3Line } from 'react-icons/ri';
import { withRouter } from 'react-router-dom';

import * as dataService from '../utils/DataService';
import './EditBreakingNewsPage.scss';

class EditBreakingNewsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { breakingNewsItems: [] };

    this.onAddNew = this.onAddNew.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  async componentDidMount() {
    const { news_articles } = await dataService.get('/api/news_articles');
    const breakingNewsItems = news_articles.map(article => ({
      ...article,
      effective_date: this.formatDate(article.effective_date),
      expiration_date: this.formatDate(article.expiration_date)
    }));

    this.setState({ breakingNewsItems });
  }

  formatDate(date) {
    return date ? new Date(date) : null;
  }

  onFieldChange(item, { target }) {
    const { value, dataset } = target;
    const { field } = dataset;
    const newItem = { ...item, [field]: value };

    this.setState(prevState => ({
      breakingNewsItems: prevState.breakingNewsItems
        .map(oldItem => (oldItem.id === newItem.id ? newItem : oldItem)),
    }));
  }

  onDatePickerChange(item, value, field) {
    const newItem = { ...item, [field]: value };

    this.setState(prevState => ({
      breakingNewsItems: prevState.breakingNewsItems
        .map(oldItem => (oldItem.id === newItem.id ? newItem : oldItem)),
    }));
  }

  onSave(item) {
    dataService.put(`/api/news_articles/${item.id}`, item);
  }

  async onDelete(item) {
    await dataService.APIDelete(`/api/news_articles/${item.id}`);

    this.setState(prevState => ({
      breakingNewsItems: prevState.breakingNewsItems
        .filter(oldItem => oldItem.id !== item.id),
    }));
  }

  async onAddNew() {
    const response = await dataService.post('/api/news_articles', {});
    const { news_article } = await response.json();

    this.setState(prevState => ({
      breakingNewsItems: [...prevState.breakingNewsItems, news_article]
    }));
  }

  renderForm(item, index) {
    return (
      <form className="news-item-form" key={item.id}>
        <div className="form-header">
          <h2>{`Breaking News Item #${index + 1}`}</h2>
          <button type="button" onClick={() => this.onSave(item)}>
            <RiSave3Line />
            Save
          </button>
          <button type="button" onClick={() => this.onDelete(item)}>
            <RiDeleteBin5Line />
            Delete
          </button>
        </div>
        <div className="form-fields">
          <div className="form-section">
            <div className="flex-grow">
              <label htmlFor="headline">Headline</label>
              <input
                id="headline"
                type="text"
                className="input"
                placeholder="Headline"
                data-field="headline"
                defaultValue={item.headline}
                onChange={e => this.onFieldChange(item, e)}
              />
            </div>
            <div>
              <label htmlFor="priority">Priority</label>
              <input
                id="priority"
                type="number"
                placeholder="Priority"
                data-field="priority"
                defaultValue={item.priority}
                onChange={e => this.onFieldChange(item, e)}
              />
            </div>
            <div>
              <label htmlFor="effective-date">Effective Date</label>
              <DatePicker
                id="effective-date"
                selected={item.effective_date}
                onChange={e => this.onDatePickerChange(item, e, 'effective_date')}
                placeholderText="Effective Date"
              />
            </div>
            <div>
              <label htmlFor="expiration-date">Expiration Date</label>
              <DatePicker
                id="expiration-date"
                selected={item.expiration_date}
                onChange={e => this.onDatePickerChange(item, e, 'expiration_date')}
                placeholderText="Expiration Date"
              />
            </div>
          </div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            type="text"
            className="textarea"
            placeholder="Body"
            data-field="body"
            defaultValue={item.body}
            onChange={e => this.onFieldChange(item, e)}
          />
        </div>
      </form>
    );
  }

  render() {
    const { breakingNewsItems } = this.state;

    return (
      <div className="edit-breaking-news-page">
        <div className="edit-breaking-news-header">
          <h1>Edit Breaking News Items</h1>
        </div>
        <div className="news-item-forms">
          {breakingNewsItems.map((item, index) => this.renderForm(item, index))}
        </div>
        <div className="edit-breaking-news-footer">
          <button type="button" onClick={this.onAddNew}>
            <RiAddBoxLine />
            Add Breaking News Story
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(EditBreakingNewsPage);
