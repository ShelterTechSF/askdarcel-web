/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import CategoriesItem from './CategoriesItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from '../../Admin.module.scss';

class CategoriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      categories: this.props.categories,
      selectedCategory: -1,
    });
  }

  render() {
    return (
      <div>
        <Accordion>
          <Card className='category'>
            <Card.Header>
              <span className={Style.CategoriesListHeader}>
                Top Level Categories
              </span>
              <span className={Style.AddCategory}>+ Add Category</span>
            </Card.Header>
          </Card>
          {this.props.categories.map((category, idx) => (
            <CategoriesItem
              key={category.id}
              category={category}
              eventKey={++idx}
            />
          ))}
        </Accordion>
      </div>
    );
  }
}

export default CategoriesList;
