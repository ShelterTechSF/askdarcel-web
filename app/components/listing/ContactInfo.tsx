import React, { Fragment, useMemo } from 'react';
import { AddressModel, PhoneNumberModel } from '../../models';

export const PhoneNumbers = ({ phones }: { phones: PhoneNumberModel[] }) => (
  <span className="phone">
    { phones.map(n => <PhoneNumber phone={n} key={n.id} />) }
  </span>
);

export const PhoneNumber = ({ phone }: { phone: PhoneNumberModel }) => (
  <p key={phone.id}>
    <a href={`tel:${phone.number}`}>{phone.number}</a>
    {` ${phone.service_type}`}
  </p>
);

export const ExternalLink = ({ children, to }: { children: any, to: string }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">{children}</a>
);

export const EmailAddress = ({ email }: { email: string }) => (
  <span className="email">
    <ExternalLink to={`mailto:${email}`}>{email}</ExternalLink>
  </span>
);

export const WebsiteLink = ({ url }: { url: string }) => (
  <span className="website">
    <ExternalLink to={url}>{url}</ExternalLink>
  </span>
);

// Given an address object, returns a React DOM element that displays the
// address on up to three lines:
//
//   <name>
//   <address_1>, <address_2>
//   <city>, <state_province>, <postal_code>
//
// Example 1:
//
//   123 Fourth Street
//   San Francisco, CA, 94115
//
// Example 2:
//
//   SF Headquarters
//   567 Eighth Street, Suite 201
//   San Francisco, CA, 94115
//
const buildLocation = (address: AddressModel) => {
  const fieldsOnEachLine = [
    ['name'],
    ['address_1', 'address_2'],
    ['city', 'state_province', 'postal_code'],
  ];

  return fieldsOnEachLine.map(fields => {
    const line = fields.map(field => (address as any)[field])
      .filter(Boolean)
      .join(', ');
    if (line.length > 0) {
      const key = fields.join('-');

      return (
        <Fragment key={key}>
          <span>{line}</span>
          <br />
        </Fragment>
      );
    }
    return null;
  });
};

export const AddressDisplay = ({ address }: { address: AddressModel }) => {
  const addr = useMemo(() => buildLocation(address), [address]);
  return <span className="address">{addr}</span>;
};

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
