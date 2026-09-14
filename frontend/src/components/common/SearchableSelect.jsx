import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  id
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  
  // Update search term when value changes externally (or initially)
  useEffect(() => {
    if (!isOpen && selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  }, [value, isOpen, selectedOption]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
    // If they clear it, we might want to clear the actual value, but 
    // it's safer to only change value on explicit select.
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center' 
        }}
      >
        <input
          id={id}
          type="text"
          className="form-input-field"
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : searchTerm)}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(''); // Clear text on focus to allow quick new search
          }}
          placeholder={placeholder}
          autoComplete="off"
          style={{ 
            width: '100%', 
            paddingRight: '30px',
            cursor: 'text'
          }}
        />
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            position: 'absolute', 
            right: '12px', 
            cursor: 'pointer',
            color: '#7091A8',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>
      </div>

      {isOpen && (
        <ul 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'var(--bg-card-tint, #122336)',
            border: '1px solid var(--border-light, #29465D)',
            borderRadius: 'var(--radius-md, 8px)',
            boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.3))',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 9999,
            listStyle: 'none',
            padding: '0.5rem',
            margin: 0
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li 
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  color: option.value === value ? 'var(--accent-teal, #3CC8C8)' : '#FFF',
                  background: option.value === value ? 'rgba(60, 200, 200, 0.1)' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) e.currentTarget.style.background = 'transparent';
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li style={{ padding: '0.75rem 1rem', color: '#7091A8', textAlign: 'center' }}>
              No countries found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
