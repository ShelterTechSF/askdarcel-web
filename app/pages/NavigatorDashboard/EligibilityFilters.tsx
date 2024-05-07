import React from "react";
import Select from "react-select";

import styles from "./EligibilityFilters.module.scss";

interface SelectOption {
  label: string;
  value: number;
}

export type SelectOptions = SelectOption[];

export const EligibilityFilters = ({
  optionsGroupArray,
  selectedEligibilities,
  setSelectedEligibilities,
  parentEligibilities,
}: {
  optionsGroupArray: SelectOptions[];
  selectedEligibilities: SelectOptions[];
  setSelectedEligibilities: (eligibilities: SelectOptions[]) => void;
  parentEligibilities: { id: number; name: string }[];
}) => {
  return (
    <div className={styles.eligibilityFilters}>
      {optionsGroupArray.map((filters, index) => (
        <div key={parentEligibilities[index].id}>
          <label>
            <p className={styles.eligibilitySelectLabel}>
              {parentEligibilities[index].name}
            </p>
            <Select
              id={`eligibilityDropdown-${index}`}
              name={`${parentEligibilities[index].name}`}
              options={filters}
              value={selectedEligibilities[index]}
              multi
              searchable={false}
              onChange={(newValues) => {
                const newEligibilities = selectedEligibilities.map((el, i) => {
                  if (i === index) {
                    return newValues as SelectOptions;
                  }
                  return el;
                });
                setSelectedEligibilities(newEligibilities);
              }}
            />
          </label>
        </div>
      ))}
    </div>
  );
};
