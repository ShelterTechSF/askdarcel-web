import React from 'react';

class SearchTabHelper extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          let altClassName = 'service-entry-tabs';
          if (child.key === this.props.active){
            altClassName = 'service-entry-tabs-active';
          }
          return(
            <div
              className={altClassName}
              onClick={() => {
                this.props.onChange(child.key);
              }}>
              {child}
            </div>
            );
        })}
        </div>
    )
  }
}

export default SearchTabHelper;