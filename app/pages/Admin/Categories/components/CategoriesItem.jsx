/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Accordion, Card, ListGroup } from 'react-bootstrap';
import Style from '../../Admin.module.scss';
import down_arrow from '../../assets/down_arrow.png';
import right_arrow from '../../assets/right_arrow.png';
import no_arrow from '../../assets/no_arrow.png';

const CategoriesItem = props => {
  const subCategories = props.category.subCategories || [];
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={props.eventKey} >
        <div className={Style.Category}>
          {
              subCategories.length > 0 ? (
                (props.selectedCategory === props.eventKey) ? 
                <img className={Style.CategoriesListArrow} src={down_arrow} /> : 
                <img className={Style.CategoriesListArrow} src={right_arrow} />
              ) : <img className={Style.CategoriesListArrow} src={no_arrow}/>
          }
          <div className={Style.CategoryName}>{props.category.name}</div>
        </div>
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
