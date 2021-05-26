/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import SubcategoriesItem from './SubcategoriesItem';

class SubcategoriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.selectSubcategory = this.selectSubcategory.bind(this);
  }

  componentDidMount() {
    this.setState({
      selectedSubcategory: null,
    });
  }

  selectSubcategory(id) {
    // function to track the selected Subcategory by id or null if all not selected
    this.setState({ selectedSubcategory: id }, () => {
      console.log(`selected selectSubcategory is ${this.state.selectedSubcategory}`);
    });
  }

  render() {
    const subCategories = this.props.subCategories || [];
    return (
      <ListGroup variant="flush">
        {
        subCategories.map(subCategory => (
          <SubcategoriesItem
            key={subCategory.id}
            subCategory={subCategory}
            selectSubcategory={this.selectSubcategory}
            selectedSubcategory={this.state.selectedSubcategory}
          />
        ))
        }
      </ListGroup>
    );
  }
}

export default SubcategoriesList;
