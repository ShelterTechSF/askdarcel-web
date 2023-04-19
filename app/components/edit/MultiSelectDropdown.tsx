import React, { Component, Fragment } from "react";
import Select from "react-select";
import * as dataService from "../../utils/DataService";
import "react-select/dist/react-select.css";

/** Base type for a selectable option.
 *
 * This is the type that external consumers of this component see, and it is
 * used as both the props for selected items as well as the handler for changing
 * the set of selected items.
 */
interface SelectOption {
  id: number;
  name: string;
}

/** Internal type for interfacing with react-select.
 *
 * react-select requires that its inputs have a label field and a value field,
 * so we internally wrap a SelectOption with this internal type.
 */
interface InternalSelectOption<T extends SelectOption> {
  label: string;
  value: T;
}

/** Transform a SelectOption to an InternalSelectOption. */
function dataToSelectValue<T extends SelectOption>(
  data: T
): InternalSelectOption<T> {
  return {
    label: data.name,
    value: data,
  };
}

type Props<T extends SelectOption> = {
  selectedItems?: T[];
  handleSelectChange: (newSelections: T[]) => void;
  optionsRoute: string;
  label: string;
};

type State<T extends SelectOption> = {
  selectedValues: InternalSelectOption<T>[];
  options: InternalSelectOption<T>[];
};

/** A multi-select dropdown menu.
 *
 * T is the type of the selection options, where T must conform to the
 * SelectOption interface.
 */
class MultiSelectDropdown<T extends SelectOption> extends Component<
  Props<T>,
  State<T>
> {
  constructor(props: Props<T>) {
    super(props);

    const { selectedItems = [] } = props;

    this.state = {
      selectedValues: selectedItems.map(dataToSelectValue),
      options: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { optionsRoute } = this.props;
    dataService.get(`/api/${optionsRoute}`).then((json) => {
      this.setState({
        options: json[optionsRoute].map(dataToSelectValue),
      });
    });
  }

  handleChange(newValues: InternalSelectOption<T>[]) {
    const { handleSelectChange } = this.props;
    this.setState({ selectedValues: newValues }, () => {
      handleSelectChange(newValues.map((val) => val.value));
    });
  }

  render() {
    const { options, selectedValues } = this.state;
    const { label } = this.props;
    return (
      <>
        <label htmlFor="categoryDropdown">{label}</label>
        <Select
          id="categoryDropdown"
          multi
          value={selectedValues}
          options={options}
          /* This `as any` type assertion is necessary to work around a lack a
           * flexibility in @types/react-select's types. When the Select
           * component is configured in `multi` mode, onChange will send an
           * array of values, not an individual value, but the current types
           * require us to define a change handler that can accept either a
           * single value or an array of values. We're currently using an
           * ancient version of react-select, so it's possible that this has
           * been fixed in future versions, especially since it looks like
           * react-select v2 is a complete rewrite, and v5 comes with native
           * TypeScript types. */
          onChange={this.handleChange as any}
        />
      </>
    );
  }
}

export default MultiSelectDropdown;
