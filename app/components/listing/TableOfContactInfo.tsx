import React from 'react';
import { Service } from '../../models';

export const TableOfContactInfo = ({ service }: { service: Service }) => {
  // TODO May break for non services, need a better check for inheritance
  const website = service.url || service.resource?.website;
  const email = service.email || service.resource?.email;
  const phones = service.resource?.phones;

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
          ) : null}

        { email
          ? (
            <tr>
              <th>Email</th>
              <td>
                <a href={`mailto:${email}`}>{email}</a>
              </td>
            </tr>
          ) : null}

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
          ) : null}

        {/* TODO Contact Person */}
      </tbody>
    </table>
  );
};
