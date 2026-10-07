import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModulePlaceholder } from '../src/components/ui/ModulePlaceholder';

describe('ModulePlaceholder', () => {
  it('should render the module title and description', () => {
    render(
      <MemoryRouter>
        <ModulePlaceholder
          title="Test Module"
          description="A test description for the module."
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(
      screen.getByText('A test description for the module.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Module coming in a later development phase'),
    ).toBeInTheDocument();
  });
});
