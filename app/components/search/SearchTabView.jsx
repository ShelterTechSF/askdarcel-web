import React from 'react';
import ReactMarkdown from 'react-markdown';
import SearchTabHelper from './SearchTabHelper';

class SearchTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: 'Description' };
  }

  getTabList() {
    const { applicationProcess, description } = this.props;

    const tabs = [['Description', description], ['How To Apply', applicationProcess]];

    return tabs
      .filter(([, content]) => content)
      .map(([title, content]) => ({
        title,
        content: <ReactMarkdown className="rendered-markdown" source={content} />,
      }));
  }

  render() {
    const { active } = this.state;
    const tabs = this.getTabList();
    const activeTab = tabs.find(tab => tab.title === active);

    return (
      <div className="service-entry-additional-info">
        <div className="service-entry-tabs">
          <SearchTabHelper
            active={active}
            onChange={newActive => this.setState({ active: newActive })}
          >
            { tabs.map(tab => <div key={tab.title}>{ tab.title }</div>) }
          </SearchTabHelper>
        </div>
        <div className="service-entry-body">
          { activeTab.content }
        </div>
      </div>
    );
  }
}

export default SearchTabView;
