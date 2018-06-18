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
  showAdd = true,
                        ) {
  return class EditCollection extends Component {
    constructor(props) {
      super(props);

      this.state = {
        collection: this.props.collection ? this.props.collection.slice() : [],
      };

      this.addItem = this.addItem.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.createItemComponents = this.createItemComponents.bind(this);
      this.removeItem = this.removeItem.bind(this);
    }

    addItem() {
      const collection = this.state.collection;
      collection.push(blankTemplateObj);
      this.setState(collection);
    }

    handleChange(index, item) {
      const collection = this.state.collection;
      /* eslint-disable no-param-reassign */
      item.dirty = true;
      collection[index] = item;
      this.setState(collection, () => this.props.handleChange(collection));
    }

    removeItem(index, item) {
      const collection = this.state.collection;
      if (collection[index].id) {
        collection[index] = { ...item, isRemoved: true };
      } else {
        collection.splice(index, 1);
      }

      this.setState(collection, () => this.props.handleChange(collection));
    }

    createItemComponents() {
      const collection = this.state.collection;
      const items = [];
      for (let i = 0; i < collection.length; i++) {
        if (!collection[i].isRemoved) {
          items.push(
            <div className="edit--section--list--item--collection-container">
              <ResourceObjectItem
                key={i}
                index={i}
                item={collection[i]}
                handleChange={this.handleChange}
              />
              <button
                className="trash-button"
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
          {showAdd &&
            <button className="edit--section--list--item--button" onClick={this.addItem}>
              <i className="material-icons">add_box</i>
              Add
            </button>
          }
        </li>
      );
    }
    };
}
