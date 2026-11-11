import { z } from 'zod';

export const STATUS_OPTIONS = [
  'Новый',
  'В работе',
  'В ожидании',
  'Успешно',
  'Отказ',
  'Партнёр',
  'VIP',
  'Архив',
  'Заблокирован',
];

export const contactSchema = z.object({
  fullName: z.string().min(1, 'Укажите ФИО'),
  company: z.string().min(1, 'Укажите компанию'),
  email: z
    .string()
    .trim()
    .refine((val) => val === '' || z.string().email().safeParse(val).success, {
      message: 'Некорректный email адрес',
    }),
  status: z.string().min(1, 'Выберите статус'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export interface ContactItem extends ContactFormData {
  id: string;
  createdAt: string;
}