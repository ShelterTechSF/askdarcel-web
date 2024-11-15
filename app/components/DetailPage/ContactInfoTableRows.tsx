import React from "react";
import { Service } from "../../models";

export const ContactInfoTableRows = ({ service }: { service: Service }) => {
  const website = service.url || service.resource?.website;
  const email = service.email || service.resource?.email;
  const phones = service.resource?.phones;

  if (!website && !phones && !email) {
    return (
      <tr>
        <td colSpan={2}>
          It seems like we have no contact info on record, please click edit and
          add it if you can!
        </td>
      </tr>
    );
  }

  return (
    <>
      {website && (
        <tr>
          <th>Website</th>
          <td>
            <a target="_blank" rel="noopener noreferrer" href={website}>
              {website}
            </a>
          </td>
        </tr>
      )}

      {email && (
        <tr>
          <th>Email</th>
          <td>
            <a href={`mailto:${email}`}>{email}</a>
          </td>
        </tr>
      )}

      {phones?.length && (
        <tr>
          <th>Phone</th>
          <td>
            <ul>
              {phones.map((phone) => (
                <li key={phone.number}>
                  <a href={`tel:${phone.number}`}>{phone.number}</a>{" "}
                  {phone.service_type && `(${phone.service_type})`}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
};
