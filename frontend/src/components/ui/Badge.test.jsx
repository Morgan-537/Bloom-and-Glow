import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders its children text', () => {
    render(<Badge tone="success">Delivered</Badge>)
    expect(screen.getByText('Delivered')).toBeInTheDocument()
  })

  it('falls back to the neutral tone for an unrecognized tone', () => {
    render(<Badge tone="not-a-real-tone">Mystery</Badge>)
    expect(screen.getByText('Mystery')).toBeInTheDocument()
  })
})
