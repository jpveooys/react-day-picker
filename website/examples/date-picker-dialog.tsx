import React from 'react';
import {
  DayPicker,
  DayPickerProps,
  Matcher,
  ModifierStatus
} from 'react-day-picker';
import { usePopper } from 'react-popper';

import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';

interface ExampleProps {
  disabled: DayPickerProps['disabled'];
  onChange: (date: Date, isDisabled: boolean) => void;
}

/**
 * Stub function
 */
function isMatch(date: Date, matcher: Matcher | Matcher[]) {
  return false;
}

export default function Example({
  onChange,
  disabled
}: ExampleProps) {
  const [selected, setSelected] = React.useState<Date>();
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  const popperReference = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const popper = usePopper(
    popperReference.current,
    popperElement,
    {
      placement: 'bottom-start'
    }
  );

  const formatDate = (date: Date) => format(date, 'P');

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    setInputValue(value);
    const date = parse(value, 'P', new Date());
    if (isValid(date)) {
      setSelected(date);
      onChange(date, isMatch(date, disabled));
    } else {
      setSelected(undefined);
      onChange(null, null);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (
    date: Date | undefined,
    _: Date,
    modifiers: ModifierStatus
  ) => {
    if (modifiers.disabled) {
      return;
    }

    if (date) {
      setInputValue(formatDate(date));
      closePopper();
    } else {
      setInputValue('');
    }

    setSelected(date);
    onChange(date, false);
  };

  const ariaLabel = selected
    ? `Choose date. Selected date is ${formatDate(selected)}`
    : 'Choose date';

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={popperReference}
        style={{
          padding: '8px 0',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        Date
        <input
          type="text"
          style={{
            marginLeft: '4px'
          }}
          placeholder="mm/dd/yyyy"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          className="clean-btn"
          style={{
            marginLeft: '4px',
            height: '40px',
            width: '40px',
            pointerEvents: isPopperOpen ? 'none' : 'all'
          }}
          aria-label={ariaLabel}
        >
          <img src="/images/logo.png" alt="DayPicker Logo" />
        </button>
      </div>
      {isPopperOpen && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: true,
            setReturnFocus: () => buttonRef.current,
            onDeactivate: () => {
              closePopper();
            }
          }}
        >
          <div
            tabIndex={-1}
            style={popper.styles.popper}
            className="dialog-sheet"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
          >
            <DayPicker
              initialFocusOnDay={isPopperOpen}
              mode="single"
              defaultMonth={selected}
              selected={selected}
              onSelect={handleDaySelect}
            />
          </div>
        </FocusTrap>
      )}
    </div>
  );
}
