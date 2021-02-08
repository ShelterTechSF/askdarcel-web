/* eslint-disable class-methods-use-this */
import React from 'react';
import CategoriesList from './components/CategoriesList';
import fake_data from './fake_data';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };

    this.addCategory = this.addCategory.bind(this);
    this.addSubcategory = this.addSubcategory.bind(this);
    this.editCategory = this.editCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentDidMount() {
    const categories = fake_data.get();
    this.setState({
      categories,
    });
  }

  addCategory(val) {
    console.log(fake_data.post(`${val}`));
  }

  addSubcategory() {}

  editCategory(id, val) {
    console.log(fake_data.update(id, val));
  }

  deleteCategory(id) {
    console.log(fake_data.del(id));
  }

  render() {
    return (
      <div>
        <div>initialize the Categories page</div>
        <CategoriesList categories={this.state.categories} />
      </div>
    );
  }
}

export default Categories;
