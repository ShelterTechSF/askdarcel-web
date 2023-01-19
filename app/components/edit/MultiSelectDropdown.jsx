import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import * as dataService from '../../utils/DataService';
import 'react-select/dist/react-select.css';

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
    const { handleSelectChange } = this.props;
    this.setState({ selectedValues: newValues }, () => {
      handleSelectChange(newValues.map((val) => val.value));
    });
  }

  render() {
    const { options, selectedValues } = this.state;
    const { label } = this.props;
    return (
      <>
        <label htmlFor="categoryDropdown">{label}</label>
        <Select
          id="categoryDropdown"
          multi
          value={selectedValues}
          options={options}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

MultiSelectDropdown.propTypes = {
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
  handleSelectChange: PropTypes.func.isRequired,
  optionsRoute: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

MultiSelectDropdown.defaultProps = {
  selectedItems: [],
};

export default MultiSelectDropdown;
