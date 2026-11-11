import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContacts, getContact, createContact, updateContact, deleteContact } from './api/contactApi';
import { ContactTable } from './components/ContactTable';
import { ContactModal } from './components/ContactModal';
import { ContactFormData, ContactItem } from './schemas/contactSchema';

export const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'fullName' | 'company' | 'status' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveId(params.get('id'));
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openContact = (id: string) => {
    if (activeId === id) return;
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url.toString());
    setActiveId(id);
  };

  const closeModal = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.toString());
    setActiveId(null);
  };

  const { data: contacts = [], isLoading } = useQuery<ContactItem[]>({
    queryKey: ['contacts', search, sortBy, sortOrder],
    queryFn: () => getContacts(search, sortBy, sortOrder),
  });

  const { data: activeContact } = useQuery<ContactItem>({
    queryKey: ['contact', activeId],
    queryFn: () => getContact(activeId!),
    enabled: Boolean(activeId),
  });

  const createMut = useMutation({
    mutationFn: (data: ContactFormData) => createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsCreating(false);
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: ContactFormData) => updateContact(activeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeModal();
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteContact(activeId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeModal();
    },
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Реестр контактов</h1>
        <button className="btn-primary" onClick={() => setIsCreating(true)}>+ Добавить контакт</button>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по ФИО, компании, статусу или дате (например, 11.11)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <ContactTable
          contacts={contacts}
          onRowClick={openContact}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}

      {isCreating && (
        <ContactModal
          onSubmit={(d) => createMut.mutate(d)}
          onClose={() => setIsCreating(false)}
          isLoading={createMut.isPending}
        />
      )}

      {activeId && activeContact && (
        <ContactModal
          contactId={activeId}
          initialData={activeContact}
          onSubmit={(d) => updateMut.mutate(d)}
          onDelete={() => deleteMut.mutate()}
          onClose={closeModal}
          isLoading={updateMut.isPending || deleteMut.isPending}
        />
      )}
    </div>
  );
};