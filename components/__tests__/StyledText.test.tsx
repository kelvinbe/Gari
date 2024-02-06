import * as React from 'react';
import { render, screen } from '@testing-library/react-native';

import { MonoText } from '../StyledText';

describe('StyledText', () => {
  beforeEach(() => {
    render(<MonoText>Test</MonoText>);
  });
  it('should render the text', () => {
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
