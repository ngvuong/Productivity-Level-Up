import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

import { customSelectStyles } from '../../lib/selectStyles';

export default function CustomSelect({
  name,
  options,
  onCreateNew,
  onInputChange,
  defaultValue,
  multiple,
  isClearable,
}) {
  const [selected, setSelected] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const onCreateOption = async (value) => {
    setIsLoading(true);
    const newOption = await onCreateNew(value);

    if (multiple) {
      setSelected([...selected, newOption]);
      onInputChange({
        name,
        value: [...selected.map((s) => s.value), newOption.value],
      });
    } else {
      setSelected(newOption);
      onInputChange({ name, value: newOption.value });
    }

    setIsLoading(false);
  };

  const onChange = (option) => {
    setSelected(option);

    if (multiple) {
      onInputChange({ name, value: option.map((o) => o.value) });
    } else {
      onInputChange({ name, value: option?.value || null });
    }
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
          styles={customSelectStyles}
          placeholder={`Select or add ${
            multiple ? 'new ' + name : 'a new ' + name
          }`}
        />
      ) : (
        <Select
          value={selected}
          onChange={onChange}
          options={options}
          isClearable={isClearable}
          placeholder={`Select ${name}`}
          styles={customSelectStyles}
        />
      )}
    </>
  );
}
