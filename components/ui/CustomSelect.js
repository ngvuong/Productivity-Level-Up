import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const styles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#1f1f1f',
  }),
  menu: (styles) => ({ ...styles, backgroundColor: '#1f1f1f' }),
  input: (styles) => ({ ...styles, color: '#dcd7de' }),
  singleValue: (styles) => ({ ...styles, color: '#c1a' }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isSelected ? '#909' : 'inherit',
    backgroundColor: isSelected ? '#bff' : isFocused ? '#ffffff33' : 'inherit',
  }),
};

export default function CustomSelect({
  name,
  options,
  onCreateNew,
  defaultValue,
}) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  return (
    <CreatableSelect
      value={selectedOption}
      onChange={setSelectedOption}
      options={options}
      onCreateOption={onCreateNew}
      isClearable
      styles={styles}
      placeholder={`Select or add a new ${name}`}
    />
  );
}
