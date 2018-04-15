import React from 'react';
import PropTypes from 'prop-types';

class ContactInfoTable extends React.Component {
  render() {
    const { item } = this.props;

    if (!item.website && !item.phones) {
      return (
        <span>
          {/* TODO Style this better with some generic warning icon? */}
          <table>
            <tbody>
              <tr>
                <td>It seems like we have no contact info on record, please click edit and add it if you can!</td>
              </tr>
            </tbody>
          </table>
          {/* <pre>{ JSON.stringify(item, null, 2) }</pre> */}
        </span>
      );
    }

    return (
      <table>
        { item.website
            ? <tr>
              <th>Website</th>
              <td>${item.website}</td>
            </tr> : null
        }

        { item.phones
            ? <tr>
              <th>Phone</th>
              <td>{ JSON.stringify(item.phones, null, 2) }</td>
              {/* TODO Render phones properly */}
            </tr> : null
        }

        {/* TODO Contact Person */}
      </table>
    );
  }
}

ContactInfoTable.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ContactInfoTable;
