import React, { useEffect, useState, useRef } from 'react'
import './Dropdown.css'
import { MdList, MdManageSearch } from "react-icons/md";
import diacritics from 'diacritics';
import categoryInterface from '../../../interfaces/config/category.interface';

interface DropdownInterface {
  categoryList: categoryInterface[];
  language?: keyof categoryInterface['displayName'];
  onSelect?: (categoryId: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reduxValue?: categoryInterface;
}

const Dropdown = ({ categoryList, language = 'spanish', onSelect, onChange, reduxValue }: DropdownInterface) => {
  
  const [isOpen, setIsOpen] = useState(false);

  const categoryListRef = useRef(categoryList);
  const [filteredCategoryList, setFilteredCategoryList] = useState(categoryListRef.current);

  const [localValue, setLocalValue] = useState(reduxValue?.displayName[language] || reduxValue?.displayName.default || '');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    categoryListRef.current = categoryList;
    setFilteredCategoryList(categoryListRef.current);
  }, [categoryList]);

  useEffect(() => {
    setLocalValue(reduxValue?.displayName[language] || reduxValue?.displayName.default || '');
  }, [reduxValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilteredCategoryList(categoryListRef.current);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (onChange) onChange(event);
    setLocalValue(value);

    // Remove diacritical marks from the input value
    const normalizedValue = diacritics.remove(value.toLowerCase());

    // Filter categories without diacritical marks and compare them
    const filteredCategories = categoryListRef.current.filter(category =>
      diacritics.remove(category.displayName[language] || category.displayName.default).toLowerCase().includes(normalizedValue)
    );

    setFilteredCategoryList(filteredCategories);
  }

  function handleCategoryClick(event: React.MouseEvent<HTMLLIElement>, categoryId: string) {
    const target = event.target as HTMLLIElement;
    console.log(target.textContent);
    inputRef.current!.value = target.textContent!;
    if (onSelect) onSelect(categoryId);
    setIsOpen(false);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setIsOpen(false);
      if (filteredCategoryList.length > 0) {
        const categoryId = filteredCategoryList[0]._id;
        inputRef.current!.value = filteredCategoryList[0].displayName[language] || filteredCategoryList[0].displayName.default;
        if (onSelect) onSelect(categoryId);
      }
      inputRef.current?.blur();
    }
  }

  const validLanguagesList = ['spanish', 'english', 'catalan'];
  let isLanguageValid = false;
  if (language) isLanguageValid = validLanguagesList.includes(language);
  if (!isLanguageValid) console.error(`Invalid language prop, expected one of: ${validLanguagesList.join(', ')}`);

  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef} onMouseDown={() => { setIsOpen(true) }}>
      <input
        type="text" className={`hoverable ${isOpen ? 'open' : ''}`} onChange={handleInputChange}
        required autoComplete="off" placeholder={`${isOpen ? 'Buscar categoría...' : ''}`}
        ref={inputRef} onKeyDown={handleKeyPress} onFocus={() => setIsOpen(true)} value={localValue}
      />
      <label>Categoría</label>
      <MdList className={`dropdown_icon ${isOpen ? 'hidden' : ''}`} />
      <MdManageSearch className={`dropdown_icon ${isOpen ? '' : 'hidden'}`} />
      <div className={`dropdown_menu ${isOpen ? 'open' : ''}`}>
        <hr />
        <div className='dropdown_menu-container'>
          <ul>
            {isLanguageValid && filteredCategoryList.map((category, index) => (
              <li key={index} onClick={(event) => handleCategoryClick(event, category._id)}>
                {category.displayName[language] || category.displayName.default}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dropdown
