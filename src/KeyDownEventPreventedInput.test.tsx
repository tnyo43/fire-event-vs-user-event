import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const MyTextField: React.FC<{}> = () => {
  const [val, setVal] = useState('foo');
  return <input value={val} onChange={(e) => setVal(e.target.value)} />;
};

const NoTypeableWrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      onKeyDown={(e) => {
        e.preventDefault();
      }}
    >
      {props.children}
    </div>
  );
};

describe('input 要素にテキストを入力して、 value に反映していることをテストする', () => {
  describe('fireEvent を使ったテスト', () => {
    test('テキストフィールドに fireEvent で値を入れると DOM の value に反映される', async () => {
      render(<MyTextField />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'bar' } });

      expect(input).toHaveValue('bar');
    });

    test('KeyDown させないラッパーで囲っても、テキストフィールドに fireEvent で値を入れると DOM の value に反映される', async () => {
      render(
        <NoTypeableWrapper>
          <MyTextField />
        </NoTypeableWrapper>
      );
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'bar' } });

      expect(input).toHaveValue('bar');
    });
  });

  describe('user-event を使ったテスト', () => {
    test('input をクリックしてテキストを入力すると DOM の value に反映される', async () => {
      render(<MyTextField />);
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      await user.tripleClick(input);
      await user.keyboard('bar');

      expect(input).toHaveValue('bar');
    });

    test('KeyDown させないラッパーで囲っていると、 input をクリックしてテキストを入力しても DOM の value に反映されない', async () => {
      render(
        <NoTypeableWrapper>
          <MyTextField />
        </NoTypeableWrapper>
      );
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      await user.tripleClick(input);
      await user.keyboard('bar');

      expect(input).not.toHaveValue('bar');
    });
  });
});
