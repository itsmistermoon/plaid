import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
} from '@ui-sdk/react/command';
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/react/dialog';
import { Search } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useT } from '../i18n';

export interface PaletteGroup {
  label: string;
  items: { value: string; label: string; icon: ReactNode }[];
}

const words = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

/** Every word typed starts a word of the command, in any order: "7 cobrar". */
export const matchesWords = (item: { label: string }, query: string) => {
  const parts = words(item.label);
  return words(query).every((word) =>
    parts.some((part) => part.startsWith(word)),
  );
};

/**
 * Command palette: a search button (also ⌘K / Ctrl+K) that opens a dialog
 * with a field over a list of commands. Running one closes it.
 */
export function CommandPalette({
  title,
  placeholder,
  groups,
  onRun,
}: {
  title: string;
  placeholder: string;
  groups: PaletteGroup[];
  onRun: (value: string) => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="dark-button palette-trigger"
        shortcut="mod+k"
        aria-label={title}
      >
        <Search aria-hidden="true" strokeWidth={2.5} />
        <span className="desktop-only">{t('search')}</span>
        <DialogShortcut className="palette-keys desktop-only" />
      </DialogTrigger>
      <DialogBackdrop className="palette-backdrop" />
      <DialogContent className="palette">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <Command
          filter={matchesWords}
          onAction={(value) => {
            onRun(value);
            setOpen(false);
          }}
        >
          <div className="search palette-search">
            <Search aria-hidden="true" className="search-icon" />
            <CommandInput aria-label={title} placeholder={placeholder} />
          </div>
          <CommandEmpty className="muted palette-empty">
            {t('noResults')}
          </CommandEmpty>
          <CommandList className="palette-list">
            {groups.map(
              (group) =>
                group.items.length > 0 && (
                  <CommandGroup key={group.label}>
                    <CommandGroupLabel className="group-label">
                      {group.label}
                    </CommandGroupLabel>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        label={item.label}
                        className="dropdown-item palette-item"
                      >
                        <CommandItemIcon>{item.icon}</CommandItemIcon>
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ),
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
