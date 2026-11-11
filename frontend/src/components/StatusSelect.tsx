import React, { useState, useRef, useEffect } from 'react';
import { STATUS_OPTIONS } from '../schemas/contactSchema';

interface Props {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const StatusSelect: React.FC<Props> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const needSearch = STATUS_OPTIONS.length > 8;
  const filtered = STATUS_OPTIONS.filter((s) => s.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <button type="button" className={`pill-btn ${error ? 'error' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{value || 'Выберите статус'}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="pill-dropdown">
          {needSearch && (
            <div className="pill-search">
              <input
                type="text"
                placeholder="Поиск статуса..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          )}
          <ul>
            {filtered.map((opt) => (
              <li
                key={opt}
                className={opt === value ? 'active' : ''}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};