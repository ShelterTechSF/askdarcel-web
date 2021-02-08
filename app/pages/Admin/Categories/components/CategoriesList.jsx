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

    this.selecteCategory = this.selecteCategory.bind(this);
  }

  componentDidMount() {
    this.setState({
      categories: this.props.categories,
      selectedCategory: null,
    });
  }

  selecteCategory(id) {
    // function to track the selected category by id or null if all not selected
    this.setState({selectedCategory: id}, ()=> {
      console.log(`selected Category is ${this.state.selectedCategory}`);
    });
    
  }

  render() {
    return (
      <div>
        <Accordion defaultActiveKey={this.state.selectedCategory} onSelect={this.selecteCategory}>
          <Card className={Style.CategoriesList}>
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
              selectedCategory={this.state.selectedCategory}
            />
          ))}
        </Accordion>
      </div>
    );
  }
}

export default CategoriesList;
