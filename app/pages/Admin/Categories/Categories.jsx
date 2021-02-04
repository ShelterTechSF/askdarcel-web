import React from "react";
import AccordionMenu from "./components/AccordionMenu";
import fake_data from "./fake_data";

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    console.log(fake_data.get());
    console.log(fake_data.update(1, {}));
    console.log(fake_data.post("food"));
    console.log(fake_data.del(1));
  }

  render() {
    return (
      <div>
        <div>initialize the Categories page</div>
        <AccordionMenu catagories={this.state.categories} />
      </div>
    );
  }
}

export default Categories;
