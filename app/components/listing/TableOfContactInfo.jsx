import React from 'react';
import PropTypes from 'prop-types';

class ContactInfoTable extends React.Component {
  render() {
    const { item } = this.props;
    // TODO May break for non services, need a better check for inheritance
    const website = item.url || item.resource.website;
    const email = item.email || item.resource.email;
    const phones = item.phones || item.resource.phones;

    if (!website && !phones && !email) {
      return (
        <span>
          {/* TODO Style this better with some generic warning icon? */}
          <table>
            <tbody>
              <tr>
                <td>
                  It seems like we have no contact info on record,
                  please click edit and add it if you can!
                </td>
              </tr>
            </tbody>
          </table>
          {/* <pre>{ JSON.stringify(item, null, 2) }</pre> */}
        </span>
      );
    }

    return (
      <table>
        <tbody>
          { website
            ? (
              <tr>
                <th>Website</th>
                <td>
                  <a href={website}>{website}</a>
                </td>
              </tr>
            ) : null
          }

          { email
            ? (
              <tr>
                <th>Email</th>
                <td>
                  <a href={`mailto:${email}`}>{email}</a>
                </td>
              </tr>
            ) : null
          }

          { phones.length
            ? (
              <tr>
                <th>Phone</th>
                <td>
                  <ul>
                    {
                      phones.map(phone => (
                        <li key={phone.number}>
                          <a href={`tel:${phone.number}`}>
                            {phone.number}
                          </a>
                          {' '}
                          {phone.service_type && `(${phone.service_type})`}
                        </li>
                      ))
                    }
                  </ul>
                </td>
              </tr>
            ) : null
          }

          {/* TODO Contact Person */}
        </tbody>
      </table>
    );
  }
}

ContactInfoTable.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ContactInfoTable;
