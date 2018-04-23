import React from 'react';
import PropTypes from 'prop-types'
import Select from 'react-select';
import * as dataService from '../../utils/DataService';

function categoryToSelectValue(category) {
  return {
    label: category.name,
    value: category,
  };
}

class CategoriesDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValues: props.categories.map(categoryToSelectValue),
      options: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    dataService.get('/api/categories').then((json) => {
      this.setState({
        options: json.categories.map(categoryToSelectValue),
      });
    });
  }

  handleChange(newValues) {
    this.setState({ selectedValues: newValues }, () => {
      this.props.handleCategoryChange(newValues.map(val => val.value));
    });
  }

  render() {
    return (
      <li className="edit--section--list--item">
        <label htmlFor="categoryDropdown">Categories</label>
        <Select
          id="categoryDropdown"
          multi
          value={this.state.selectedValues}
          options={this.state.options}
          onChange={this.handleChange}
        />
      </li>
    );
  }
}

CategoriesDropdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ),
  handleCategoryChange: PropTypes.func.isRequired,
};

CategoriesDropdown.defaultProps = {
  categories: [],
};

export default CategoriesDropdown;
