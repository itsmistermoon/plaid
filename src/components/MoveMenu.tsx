import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from '@ui-sdk/react/menu';
import { ArrowRightLeft } from 'lucide-react';
import { useT } from '../i18n';

/**
 * The Garzón's menu to move a Mesa: its Pedidos and Llamados go to a free
 * Mesa (transfer) or join an occupied one (merge).
 */
export function MoveMenu({
  targets,
  onMove,
}: {
  /** Every other Mesa of the floor. */
  targets: { number: number; occupied: boolean }[];
  onMove?: (to: number) => void;
}) {
  const t = useT();
  const groups = [
    { label: t('moveToFree'), items: targets.filter((item) => !item.occupied) },
    { label: t('mergeWith'), items: targets.filter((item) => item.occupied) },
  ];
  return (
    <Menu onAction={(value) => onMove?.(Number(value))}>
      <MenuTrigger className="dark-button move-button">
        <ArrowRightLeft aria-hidden="true" />
        {t('moveTable')}
      </MenuTrigger>
      <MenuContent className="dropdown-list move-list" side="top">
        {groups.map(
          (group) =>
            group.items.length > 0 && (
              <MenuGroup key={group.label}>
                <MenuGroupLabel className="group-label">
                  {group.label}
                </MenuGroupLabel>
                {group.items.map((item) => (
                  <MenuItem
                    key={item.number}
                    value={`${item.number}`}
                    className="dropdown-item"
                  >
                    {t('tableN')(item.number)}
                  </MenuItem>
                ))}
              </MenuGroup>
            ),
        )}
      </MenuContent>
    </Menu>
  );
}
