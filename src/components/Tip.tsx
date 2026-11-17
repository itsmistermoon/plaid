import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from '@ui-sdk/react/tooltip';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

/**
 * A control with a short hint on hover and keyboard focus (UI SDK's Tooltip).
 * `render` is the control itself (a button or a link); the hint names an
 * icon-only control (`naming`) or describes one that already has a name.
 */
export function Tip({
  hint,
  naming,
  disabled,
  side = 'bottom',
  render,
  children,
}: {
  hint: string;
  /** The hint repeats the control's name instead of adding a description. */
  naming?: boolean;
  /** No hint: the control already shows its text. */
  disabled?: boolean;
  side?: ComponentProps<typeof TooltipContent>['side'];
  render: ReactElement<Record<string, unknown>>;
  children: ReactNode;
}) {
  return (
    <Tooltip disabled={disabled} type={naming ? 'label' : 'description'}>
      <TooltipTrigger render={render}>{children}</TooltipTrigger>
      <TooltipContent className="tip" side={side} sideOffset={8}>
        <TooltipArrow className="tip-arrow" />
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}
