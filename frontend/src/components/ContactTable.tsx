import React from 'react';
import { ContactItem } from '../schemas/contactSchema';

interface Props {
  contacts: ContactItem[];
  onRowClick: (id: string) => void;
  onSort: (field: 'fullName' | 'company' | 'status' | 'createdAt') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const ContactTable: React.FC<Props> = ({ contacts, onRowClick, onSort, sortBy, sortOrder }) => {
  const renderArrow = (field: string) => {
    if (sortBy !== field) return <span style={{ color: '#ccc', marginLeft: '4px' }}>↕</span>;
    return <span style={{ color: '#3182ce', marginLeft: '4px' }}>{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort('fullName')}>ФИО {renderArrow('fullName')}</th>
          <th onClick={() => onSort('company')}>Компания {renderArrow('company')}</th>
          <th onClick={() => onSort('status')}>Статус {renderArrow('status')}</th>
          <th onClick={() => onSort('createdAt')}>Дата создания {renderArrow('createdAt')}</th>
        </tr>
      </thead>
      <tbody>
        {contacts.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center' }}>Контакты не найдены</td>
          </tr>
        ) : (
          contacts.map((c) => (
            <tr key={c.id} onClick={() => onRowClick(c.id)} className="clickable">
              <td>{c.fullName}</td>
              <td>{c.company}</td>
              <td><span className="badge">{c.status}</span></td>
              <td>{new Date(c.createdAt).toLocaleDateString('ru-RU')}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};