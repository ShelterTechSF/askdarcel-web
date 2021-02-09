/* eslint-disable class-methods-use-this */
import React from 'react';
import fake_data from './fake_data';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };

    this.getCategories = this.getCategories.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.addSubcategories = this.addSubcategories.bind(this);
    this.editCategory = this.editCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentDidMount() {
    const categories = this.getCategories();
    this.setState({
      categories,
    }, () => {
      console.log(categories);
    });
  }

  getCategories() {
    return fake_data.get();
  }

  addCategory(val) {
    fake_data.post(val);
  }

  addSubcategories(categoryId, newCategories = []) {
    fake_data.addSubcategories(categoryId, newCategories);
  }

  editCategory(id, category) {
    fake_data.update(id, category);
  }

  deleteCategory(id) {
    fake_data.del(id);
  }

  render() {
    return (
      <div>
        <div>initialize the Categories page</div>
      </div>
    );
  }
}

export default Categories;
