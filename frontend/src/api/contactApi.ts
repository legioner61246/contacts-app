import { ContactItem, ContactFormData } from '../schemas/contactSchema';

const API = 'http://localhost:4000/api/contacts';

export async function getContacts(search: string, sortBy: string, sortOrder: string): Promise<ContactItem[]> {
  const p = new URLSearchParams({ search, sortBy, sortOrder });
  const res = await fetch(`${API}?${p}`);
  return res.json();
}

export async function getContact(id: string): Promise<ContactItem> {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

export async function createContact(data: ContactFormData) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateContact(id: string, data: ContactFormData) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteContact(id: string) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}