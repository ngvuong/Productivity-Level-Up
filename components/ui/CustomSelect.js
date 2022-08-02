import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

const styles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#1f1f1f',
    borderRadius: '1rem',
  }),
  menuList: (styles) => ({
    ...styles,
    backgroundColor: '#1f1f1f',
    maxHeight: '20rem',
    overflow: 'auto',
  }),
  input: (styles) => ({ ...styles, color: '#dcd7de' }),
  singleValue: (styles, { data }) => ({
    ...styles,

    color:
      data.value === 'P3'
        ? '#55ff00'
        : data.value === 'P2'
        ? '#0055ff'
        : data.value === 'P1'
        ? '#ff0055'
        : '#c1a',
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: '#1f1f1f',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    backgroundColor: '#fc0',
  }),
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
  onInputChange,
  defaultValue,
  multiple,
}) {
  const [selected, setSelected] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const onCreateOption = async (value) => {
    setIsLoading(true);
    const newOption = await onCreateNew(value);

    if (multiple) {
      setSelected([...selected, newOption]);
    } else {
      setSelected(newOption);
    }

    setIsLoading(false);
  };

  const onChange = (option) => {
    setSelected(option);
    if (multiple) {
      onInputChange({ name, value: option.map((o) => o.value) });
    } else {
      onInputChange({ name, value: option.value });
    }
    console.log(option);
  };

  return (
    <>
      {onCreateNew ? (
        <CreatableSelect
          value={selected}
          onChange={onChange}
          options={options}
          onCreateOption={onCreateOption}
          isLoading={isLoading}
          isClearable
          isMulti={multiple}
          styles={styles}
          placeholder={`Select or add ${
            multiple ? 'new ' + name : 'a new ' + name
          }`}
        />
      ) : (
        <Select
          value={selected}
          onChange={onChange}
          options={options}
          styles={styles}
        />
      )}
    </>
  );
}
