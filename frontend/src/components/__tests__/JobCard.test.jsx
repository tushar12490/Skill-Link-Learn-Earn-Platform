import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import JobCard from '../JobCard.jsx';
import createAppTheme from '../../theme.js';

const baseJob = {
  id: 1,
  title: 'Build analytics dashboard',
  description: 'Create charts and integrate APIs',
  budget: 2500,
  status: 'OPEN',
  createdAt: new Date().toISOString(),
  requiredSkills: ['React', 'D3'],
  clientId: 2,
  clientName: 'Acme Corp',
  freelancerId: null,
  freelancerName: null
};

const darkTheme = createAppTheme('dark');

const renderWithTheme = (ui) => render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);

describe('JobCard', () => {
  it('allows freelancers to submit a proposal when the job is open', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    renderWithTheme(
      <JobCard
        job={baseJob}
        canApply
        applicationStatus={null}
        onApply={onApply}
        currentUserId={10}
      />
    );

    const button = screen.getByRole('button', { name: /submit proposal/i });
    expect(button).toBeEnabled();

    await act(async () => {
      await user.click(button);
    });
    expect(onApply).toHaveBeenCalledWith(baseJob.id);
  });

  it('shows client management actions with proposal summary', () => {
    renderWithTheme(
      <JobCard
        job={{ ...baseJob, freelancerId: 42, freelancerName: 'Taylor Freelance', status: 'IN_PROGRESS' }}
        canApply={false}
        isClientView
        onViewApplications={() => {}}
        currentUserId={2}
        applicationStatus="ACCEPTED"
      />
    );

    expect(screen.getByText(/assigned: taylor freelance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view proposals/i })).toBeInTheDocument();
    expect(screen.getByText(/accepted/i)).toBeInTheDocument();
  });
});
