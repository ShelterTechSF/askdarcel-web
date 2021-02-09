/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Accordion, Card, ListGroup } from 'react-bootstrap';

const CategoriesItem = props => {
  const subCategories = props.category.subCategories || [];
  return (
    <Card className='category'>
      <Accordion.Toggle as={Card.Header} eventKey={props.eventKey}>
        {props.category.name}
      </Accordion.Toggle>
      {subCategories.length > 0 ? (
        <Accordion.Collapse eventKey={props.eventKey}>
          <Card.Body>
            <ListGroup>
              {subCategories.map(subCategory => (
                <ListGroup.Item key={subCategory.id}>
                  {subCategory.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Accordion.Collapse>
      ) : null}
    </Card>
  );
};

export default CategoriesItem;
