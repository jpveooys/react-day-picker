import React from 'react';

import { customRender } from '@test/render';

import { DayPickerProps } from '../../types';
import { Button, ButtonProps } from './Button';

let button: HTMLButtonElement;

function setup(props?: ButtonProps, context?: DayPickerProps) {
  const renderResult = customRender(<Button {...props} />, context);
  button = renderResult.container.firstChild as HTMLButtonElement;
}

describe('when rendered without props', () => {
  beforeEach(() => setup());
  test('should render a button with type "button"', () => {
    expect(button).toHaveAttribute('type', 'button');
  });
  test('should render a button with the button class name', () => {
    expect(button).toHaveClass('rdp-button');
  });
  test('should render a button with the reset class name', () => {
    expect(button).toHaveClass('rdp-button_reset');
  });
});

describe('when rendered with the className prop', () => {
  const className = 'foo';
  beforeEach(() => setup({ className }));
  test('should add the class name', () => {
    expect(button).toHaveClass(className);
  });
});

describe('when rendered with the style prop', () => {
  const style = { color: 'blue' };
  beforeEach(() => setup({ style }));
  test('should add the class name', () => {
    expect(button).toHaveStyle(style);
  });
});

describe('when using class names and styles from context', () => {
  const context = {
    classNames: { button: 'foo' },
    styles: { button: { color: 'red' } }
  };
  beforeEach(() => setup({}, context));

  test('should apply the style', () => {
    expect(button).toHaveStyle({ color: 'red' });
  });
  test('should apply the class name', () => {
    expect(button).toHaveClass('foo');
  });
});
