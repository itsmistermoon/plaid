import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/react/dialog';
import { Input, InputGroup } from '@ui-sdk/react/input';
import { X } from 'lucide-react';
import { useState } from 'react';
import {
  isReserved,
  type Reservation,
  reservationDays,
  reservationSlots,
} from '../domain';
import { useLang, useT } from '../i18n';
import { Dropdown } from './Dropdown';
import { Selector } from './Selector';

interface BookProps {
  reservations: Reservation[];
  /** Numbers of the floor's Mesas. */
  tables: number[];
  onReserve: (reservation: Omit<Reservation, 'id'>) => void;
  onCancel: (id: string) => void;
  /** Called each time the book opens. */
  onOpen?: () => void;
}

const dayOffsets = Array.from({ length: reservationDays }, (_, index) => index);
/** The calendar date that many days from today. */
const dateIn = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * The page of the reservation book for a day: every hour with the Mesas held
 * at it, and a line to write a new reservation.
 */
export function ReservationBook({
  reservations,
  tables,
  onReserve,
  onCancel,
}: BookProps) {
  const t = useT();
  const lang = useLang();
  const locale = lang === 'es' ? 'es-CL' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const full = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const [day, setDay] = useState(0);
  const [table, setTable] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const taken =
    !!table &&
    !!time &&
    isReserved(reservations, { table: Number(table), day, time });
  return (
    <div className="book-page">
      {/* A strip with every day of the week: a face of weekday over date. */}
      <Selector
        className="book-day"
        legend={t('bookDay')}
        value={`${day}`}
        options={dayOffsets.map((offset) => {
          const date = dateIn(offset);
          return {
            value: `${offset}`,
            label: full.format(date),
            face: (
              <>
                <small>{weekday.format(date).replace('.', '')}</small>
                <b>{date.getDate()}</b>
              </>
            ),
          };
        })}
        onChange={(value) => setDay(Number(value))}
      />
      <p className="book-date">
        {t('bookDays')[day] ? `${t('bookDays')[day]} · ` : ''}
        {full.format(dateIn(day))}
      </p>
      <ol className="book-slots">
        {reservationSlots.map((slot) => {
          const held = reservations.filter(
            (item) => item.day === day && item.time === slot,
          );
          return (
            <li key={slot}>
              <time>{slot}</time>
              {held.length ? (
                <ul className="book-entries">
                  {held.map((item) => (
                    <li key={item.id}>
                      {t('tableN')(item.table)} · {item.name}
                      <button
                        type="button"
                        className="book-cancel"
                        aria-label={t('bookCancel')(item.name)}
                        onClick={() => onCancel(item.id)}
                      >
                        <X aria-hidden="true" strokeWidth={3} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="book-free">{t('free')}</span>
              )}
            </li>
          );
        })}
      </ol>
      <form
        className="book-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!table || !time || taken || !name.trim()) return;
          onReserve({ table: Number(table), day, time, name });
          setName('');
        }}
      >
        <Dropdown
          label={t('bookTable')}
          items={tables.map((number) => ({
            value: `${number}`,
            label: t('tableN')(number),
          }))}
          value={table}
          onChange={setTable}
        />
        <Dropdown
          label={t('bookTime')}
          items={reservationSlots.map((slot) => ({ value: slot, label: slot }))}
          value={time}
          onChange={setTime}
          invalid={taken}
        />
        <InputGroup className="search book-name">
          <Input
            aria-label={t('bookName')}
            placeholder={t('bookName')}
            value={name}
            onValueChange={setName}
          />
        </InputGroup>
        <button
          type="submit"
          className="light-button"
          disabled={!table || !time || taken || !name.trim()}
        >
          {t('bookAdd')}
        </button>
        {/* The line keeps its place while there is nothing to say. */}
        <p className="book-hint" role="status">
          {taken ? t('bookTaken') : ''}
        </p>
      </form>
    </div>
  );
}

/** The book as a dialog, opened from a text button. */
export function ReservationBookButton({ onOpen, ...props }: BookProps) {
  const t = useT();
  return (
    <Dialog onOpenChange={(open) => open && onOpen?.()}>
      <DialogTrigger className="dark-button book-trigger" data-tour="reservar">
        {t('bookButton')}
      </DialogTrigger>
      <DialogBackdrop className="palette-backdrop" />
      <DialogContent className="book">
        <div className="book-head">
          <DialogTitle render={(title) => <h3 {...title} />}>
            {t('book')}
          </DialogTitle>
          <DialogClose className="dark-button">{t('closeDetail')}</DialogClose>
        </div>
        <ReservationBook {...props} />
      </DialogContent>
    </Dialog>
  );
}
