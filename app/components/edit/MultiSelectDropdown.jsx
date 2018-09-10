import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import * as dataService from '../../utils/DataService';

function dataToSelectValue(data) {
  return {
    label: data.name,
    value: data,
  };
}

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValues: props.selectedItems.map(dataToSelectValue),
      options: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { optionsRoute } = this.props;
    dataService.get(`/api/${optionsRoute}`).then((json) => {
      this.setState({
        options: json[optionsRoute].map(dataToSelectValue),
      });
    });
  }

  handleChange(newValues) {
    this.setState({ selectedValues: newValues }, () => {
      this.props.handleSelectChange(newValues.map(val => val.value));
    });
  }

  render() {
    return (
      <li className="edit--section--list--item">
        <label htmlFor="categoryDropdown">{this.props.label}</label>
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

MultiSelectDropdown.propTypes = {
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ),
  handleSelectChange: PropTypes.func.isRequired,
  optionsRoute: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

MultiSelectDropdown.defaultProps = {
  selectedItems: [],
};

export default MultiSelectDropdown;
