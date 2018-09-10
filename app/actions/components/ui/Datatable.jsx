import React from 'react';
import PropTypes from 'prop-types';

class Datatable extends React.Component {
  render() {
    const { rows, rowRenderer } = this.props;
    return (
      <table>
        <tbody>
          { rows.map(row => rowRenderer(row)) }
        </tbody>
      </table>
    );
  }
}

Datatable.propTypes = {
  rowRenderer: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
};

export default Datatable;
