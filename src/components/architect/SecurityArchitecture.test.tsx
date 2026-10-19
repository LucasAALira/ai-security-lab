import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { architectProjects } from '@/data/architect'
import { SecurityArchitecture } from './SecurityArchitecture'

afterEach(cleanup)
describe('DAS dos projetos', () => {
  for (const project of architectProjects) {
    it(`permite explorar ${project.id} pelo teclado sem revelar o gabarito`, async () => {
      const user = userEvent.setup()
      render(<SecurityArchitecture project={project} />)
      for (const component of project.components) {
        expect(screen.getByRole('button', { name: `Explorar ${component.label}` })).toBeInTheDocument()
      }
      const first = project.components[0]
      const button = screen.getByRole('button', { name: `Explorar ${first.label}` })
      button.focus()
      await user.keyboard('{Enter}')
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('heading', { name: first.label })).toBeInTheDocument()
      for (const threat of first.threats) expect(screen.queryByText(threat.why)).not.toBeInTheDocument()
      await user.keyboard(' ')
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })
  }
})
