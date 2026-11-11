import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData, STATUS_OPTIONS } from '../schemas/contactSchema';
import { StatusSelect } from './StatusSelect';

interface Props {
  contactId?: string | null;
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ContactModal: React.FC<Props> = ({ contactId, initialData, onSubmit, onDelete, onClose, isLoading }) => {
  const isEdit = Boolean(contactId);
  const draftKey = isEdit ? `contact_draft_edit_${contactId}` : 'contact_draft_create';

  const baseValues: ContactFormData = initialData || {
    fullName: '',
    company: '',
    email: '',
    status: STATUS_OPTIONS[0],
  };

  const [hasDraft, setHasDraft] = useState(false);

  const getInitialValues = (): ContactFormData => {
    if (initialData) return baseValues;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.values(parsed).some((v) => v)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return baseValues;
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: getInitialValues(),
  });
  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Object.values(parsed).some((v) => v)) {
            setHasDraft(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [draftKey, initialData]);

  const formValues = watch();
  useEffect(() => {
    if (!initialData) {
      localStorage.setItem(draftKey, JSON.stringify(formValues));
    }
  }, [formValues, draftKey, initialData]);

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setHasDraft(false);
    reset(baseValues);
  };
  const handleFormSubmit = (data: ContactFormData) => {
    localStorage.removeItem(draftKey); 
    onSubmit(data);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{isEdit ? 'Редактирование контакта' : 'Новый контакт'}</h2>

        {hasDraft && (
          <div className="draft-banner">
            <span>Восстановлены несохранённые данные</span>
            <button type="button" onClick={clearDraft}>Очистить</button>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="field">
            <label>ФИО *</label>
            <input {...register('fullName')} placeholder="Иванов Иван" />
            {errors.fullName && <span className="error-msg">{errors.fullName.message}</span>}
          </div>

          <div className="field">
            <label>Компания *</label>
            <input {...register('company')} placeholder="Название компании" />
            {errors.company && <span className="error-msg">{errors.company.message}</span>}
          </div>

          <div className="field">
            <label>Email</label>
            <input {...register('email')} placeholder="mail@example.com" />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          <div className="field">
            <label>Статус *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <StatusSelect value={field.value} onChange={field.onChange} error={errors.status?.message} />
              )}
            />
          </div>

          <div className="modal-actions" style={{ justifyContent: isEdit ? 'space-between' : 'flex-end' }}>
            {isEdit && onDelete && (
              <button type="button" onClick={onDelete} className="btn-danger">
                Удалить
              </button>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};