import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCategories } from 'models/categories';

import { Footer, Navigation, Loader } from 'components/ui';
import { FindHeader } from 'components/search';
import { CategoryLink } from 'components/layout';

class HomePage extends React.Component {
  componentWillMount() {
    this.props.fetchCategories({ top: true });
  }

  renderCategorySection() {
    const { categoryList } = this.props;
    if (!categoryList) { return <Loader />; }

    return (
      <section className="category-list" role="main">
        <header>
          <h2>Most used categories</h2>
        </header>
        <ul className="category-items">
          {
            categoryList.map(cat =>
              <CategoryLink key={cat.id} name={cat.name} categoryid={cat.id} />,
            )
          }
        </ul>
      </section>
    );
  }

  render() {
    return (
      <div className="find-page">
        <Navigation />
        <div>
          <FindHeader />
          { this.renderCategorySection() }
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.categories }),
  dispatch => bindActionCreators({ fetchCategories }, dispatch),
)(HomePage);
