export const customSelectStyles = {
  container: (styles) => ({
    ...styles,
    alignSelf: 'center',
    minWidth: '15rem',
  }),
  control: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    textAlign: 'center',
    backgroundColor: '#151515',
    border: 'none',
    borderRadius: '1rem',
  }),
  menu: (styles) => ({ ...styles, borderRadius: '1rem' }),
  menuList: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    maxHeight: '20rem',
    textAlign: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: '1rem',
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
  option: (styles, { isFocused, isSelected, isDisabled }) => ({
    ...styles,
    color: isSelected ? '#909' : 'inherit',
    fontWeight: isSelected ? 'bold' : 'normal',
    backgroundColor: isSelected ? '#bff' : isFocused ? '#ffffff33' : 'inherit',
    borderRadius: '1rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    '&:active': { backgroundColor: isSelected ? '#bff' : 'inherit' },
  }),
};

export const dateSelectStyles = {
  container: customSelectStyles.container,
  control: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    textAlign: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #ccc',
    boxShadow: 'none',
  }),
  menu: customSelectStyles.menu,
  menuList: customSelectStyles.menuList,
  singleValue: (styles) => ({
    ...styles,
    color: '#fc2',
  }),
  option: customSelectStyles.option,
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
};

export const timeSelectStyles = {
  container: (styles, { isDisabled }) => ({
    ...styles,
    width: 'fit-content',
    minWidth: '14.5rem',
    opacity: isDisabled ? 0.5 : 1,
  }),
  control: customSelectStyles.control,
  menu: customSelectStyles.menu,
  menuList: customSelectStyles.menuList,
  input: customSelectStyles.input,
  singleValue: (styles) => ({
    ...styles,
    color: '#c1a',
  }),
  option: customSelectStyles.option,
  indicatorSeparator: dateSelectStyles.indicatorSeparator,
};

export const plumSelectStyles = {
  container: (styles) => ({
    ...styles,
    alignSelf: 'center',
    width: '20rem',
  }),
  control: (styles) => ({
    ...styles,
    textAlign: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #ccc',
    borderRadius: '0',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'inherit',
      opacity: '.8',
    },
  }),
  menuList: (styles) => ({
    ...styles,
    textAlign: 'center',
    backgroundColor: '#1f1f1f',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#dcd7de',
    fontWeight: 'bold',
  }),
  placeholder: (styles) => ({
    ...styles,
    color: '#dcd7de',
  }),
  option: customSelectStyles.option,
  indicatorsContainer: (styles) => ({
    ...styles,
    display: 'none',
  }),
};
