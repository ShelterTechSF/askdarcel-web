/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from '../../Admin.module.scss';

const SubcategoriesItem = props => {
  const isSelected = props.subCategory.id === props.selectedSubcategory;
  return (
    <ListGroup.Item
      className={Style.Subcategory}
      action
      onClick={() => props.selectSubcategory(props.subCategory.id)}
    >
      <div className={Style.CategoryName}>{props.subCategory.name}</div>
      <div className={Style.CategorySpacer} />
      {isSelected ? <div className={Style.EditSubcategory}>Edit Subcategory</div> : null}
    </ListGroup.Item>
  );
};

export default SubcategoriesItem;
