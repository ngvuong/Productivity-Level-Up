export const customSelectStyles = {
  control: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    backgroundColor: '#151515',
    borderRadius: '1rem',
  }),
  menuList: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    maxHeight: '20rem',
    backgroundColor: '#1f1f1f',
    overflow: 'auto',
  }),
  input: (styles) => ({ ...styles, color: '#dcd7de' }),
  singleValue: (styles, { data }) => ({
    ...styles,

    color:
      data.value === 'P3'
        ? '#8f0'
        : data.value === 'P2'
        ? '#08f'
        : data.value === 'P1'
        ? '#f08'
        : '#c1a',
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: '#151515',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    backgroundColor: '#fc2',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isSelected ? '#909' : 'inherit',
    backgroundColor: isSelected ? '#bff' : isFocused ? '#ffffff33' : 'inherit',
  }),
};

export const dateSelectStyles = {
  control: (styles) => ({
    ...styles,
    minWidth: '10rem',
    fontSize: '1.2rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #ccc',
    boxShadow: 'none',
  }),
  menu: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    maxHeight: '20rem',
    backgroundColor: '#1f1f1f',
    overflow: 'auto',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#fc2',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isSelected ? '#909' : 'inherit',
    backgroundColor: isSelected ? '#bff' : isFocused ? '#ffffff33' : 'inherit',
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
};
