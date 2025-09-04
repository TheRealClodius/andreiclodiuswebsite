/**
 * Button Stories - Usage examples for the Button component
 * 
 * This file demonstrates all Button variants, sizes, and states.
 * Use this for testing and documentation.
 */

// React import not needed in this file
import { Button } from './Button'

export default {
  title: 'Primitives/Button',
  component: Button,
}

// All button variants
export const Variants = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
)

// All button sizes
export const Sizes = () => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

// Button states
export const States = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button>Normal</Button>
    <Button loading>Loading</Button>
    <Button disabled>Disabled</Button>
  </div>
)

// Motion enabled buttons
export const WithMotion = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button asMotion>Hover Me!</Button>
    <Button asMotion variant="secondary">Motion Secondary</Button>
    <Button asMotion variant="ghost">Motion Ghost</Button>
  </div>
)

// Full width button
export const FullWidth = () => (
  <div style={{ width: '300px' }}>
    <Button fullWidth>Full Width Button</Button>
  </div>
)

// With icons
export const WithIcons = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button icon={<span>🚀</span>}>Left Icon</Button>
    <Button icon={<span>→</span>} iconPosition="right">Right Icon</Button>
  </div>
)
