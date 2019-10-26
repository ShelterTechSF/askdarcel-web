import React, { Component } from 'react';

/**
 *
 * @param {Component} ResourceObjectItem individual component to have a collection for
 * @param {string} label title field for items
 * @param {Object} blankTemplateObj blank template to fill new items in the collection with
 */
export default function editCollectionHOC(ResourceObjectItem,
  label,
  blankTemplateObj,
  showAdd = true) {
  return class EditCollection extends Component {
    constructor(props) {
      super(props);

      const { collection = [] } = this.props;

      this.state = {
        collection: collection.slice(),
      };

      this.addItem = this.addItem.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.createItemComponents = this.createItemComponents.bind(this);
      this.removeItem = this.removeItem.bind(this);
    }

    addItem() {
      const { collection } = this.state;
      collection.push(blankTemplateObj);
      this.setState(collection);
    }

    handleChange(index, item) {
      const { handleChange } = this.props;
      const { collection } = this.state;
      /* eslint-disable no-param-reassign */
      item.dirty = true;
      collection[index] = item;
      this.setState(collection, () => handleChange(collection));
    }

    removeItem(index, item) {
      const { handleChange } = this.props;
      const { collection } = this.state;
      if (collection[index].id) {
        collection[index] = { ...item, isRemoved: true };
      } else {
        collection.splice(index, 1);
      }

      this.setState(collection, () => handleChange(collection));
    }

    createItemComponents() {
      const { collection } = this.state;
      const items = [];
      for (let i = 0; i < collection.length; i++) {
        if (!collection[i].isRemoved) {
          items.push(
            <div key={i} className="edit--section--list--item--collection-container">
              <ResourceObjectItem
                index={i}
                item={collection[i]}
                handleChange={this.handleChange}
              />
              <button
                type="button"
                className="trash-button icon-button"
                onClick={() => this.removeItem(i, collection[i])}
              >
                <i className="material-icons">&#xE872;</i>
              </button>
            </div>,
          );
        }
      }

      return items;
    }

    render() {
      return (
        <li className="edit--section--list--item edit--notes">
          <label htmlFor="edit-item">{label}</label>
          <ul className="edit--section--list--item--sublist">
            {this.createItemComponents()}
          </ul>
          {showAdd
            && (
              <button type="button" className="edit--section--list--item--button" onClick={this.addItem}>
                <i className="material-icons">add_box</i>
              Add
              </button>
            )
          }
        </li>
      );
    }
  };
}
