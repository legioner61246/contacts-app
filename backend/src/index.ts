import express, { Request, Response } from 'express';
import cors from 'cors';

interface Contact {
  id: string;
  fullName: string;
  company: string;
  email?: string;
  status: string;
  createdAt: string;
}

const app = express();
app.use(cors());
app.use(express.json());

let contacts: Contact[] = [
  {
    id: '1',
    fullName: 'Иванов Иван Петрович',
    company: 'ООО Вектор',
    email: 'ivanov@vector.ru',
    status: 'Активный',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '2',
    fullName: 'Петрова Анна Сергеевна',
    company: 'АО Технологии',
    email: 'petrova@tech.com',
    status: 'В ожидании',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

app.get('/api/contacts', (req: Request, res: Response) => {
  const { search, sortBy, sortOrder } = req.query;
  let result = [...contacts];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter((c) => {
      const dateStr = new Date(c.createdAt).toLocaleDateString('ru-RU'); // формат ДД.ММ.ГГГГ
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        dateStr.includes(q)
      );
    });
  }

  if (sortBy && typeof sortBy === 'string') {
    const order = sortOrder === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const valA = String(a[sortBy as keyof Contact] || '');
      const valB = String(b[sortBy as keyof Contact] || '');
      return valA.localeCompare(valB) * order;
    });
  }

  res.json(result);
});

app.get('/api/contacts/:id', (req: Request, res: Response) => {
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) return res.status(404).json({ message: 'Не найдено' });
  res.json(contact);
});

app.post('/api/contacts', (req: Request, res: Response) => {
  const { fullName, company, email, status } = req.body;
  if (!fullName || !company || !status) {
    return res.status(400).json({ message: 'Заполните обязательные поля' });
  }
  const newContact: Contact = {
    id: Date.now().toString(),
    fullName,
    company,
    email: email || '',
    status,
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(newContact);
  res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req: Request, res: Response) => {
  const index = contacts.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Не найдено' });

  const { fullName, company, email, status } = req.body;
  contacts[index] = {
    ...contacts[index],
    fullName: fullName ?? contacts[index].fullName,
    company: company ?? contacts[index].company,
    email: email ?? contacts[index].email,
    status: status ?? contacts[index].status,
  };

  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req: Request, res: Response) => {
  const index = contacts.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Не найдено' });
  contacts.splice(index, 1);
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Бэкенд успешно запущен на http://localhost:${PORT}`);
});