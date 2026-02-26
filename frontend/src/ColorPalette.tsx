/* filepath: src/ColorPalette.tsx */
import { ThemeToggle } from './components/ThemeToggle';

export function ColorPalette() {
  const colorGroups = {
    Background: [
      { name: 'Background', class: 'bg-background' },
      { name: 'Card', class: 'bg-card' },
      { name: 'Popover', class: 'bg-popover' },
      { name: 'Surface', class: 'bg-surface' },
      { name: 'Elevated', class: 'bg-elevated' },
      { name: 'Overlay', class: 'bg-overlay' },
      { name: 'Glass', class: 'bg-glass' },
    ],
    Text: [
      { name: 'Foreground', class: 'bg-foreground' },
      { name: 'Foreground Secondary', class: 'bg-foreground-secondary' },
      { name: 'Muted', class: 'bg-muted' },
      { name: 'Inverse', class: 'bg-inverse' },
    ],
    Border: [
      { name: 'Border', class: 'bg-border' },
      { name: 'Border Subtle', class: 'bg-border-subtle' },
      { name: 'Ring', class: 'bg-ring' },
    ],
    Interactive: [
      { name: 'Primary', class: 'bg-primary' },
      { name: 'Primary Hover', class: 'bg-primary-hover' },
      { name: 'Primary Active', class: 'bg-primary-active' },
      { name: 'Accent', class: 'bg-accent' },
      { name: 'Accent Hover', class: 'bg-accent-hover' },
      { name: 'Link', class: 'bg-link' },
      { name: 'Link Hover', class: 'bg-link-hover' },
      { name: 'Disabled', class: 'bg-disabled' },
    ],
    Input: [
      { name: 'Input', class: 'bg-input' },
      { name: 'Placeholder', class: 'bg-placeholder' },
    ],
    Semantic: [
      { name: 'Destructive', class: 'bg-destructive' },
      { name: 'Destructive Hover', class: 'bg-destructive-hover' },
      { name: 'Destructive Subtle', class: 'bg-destructive-subtle' },
      { name: 'Success', class: 'bg-success' },
      { name: 'Success Hover', class: 'bg-success-hover' },
      { name: 'Success Subtle', class: 'bg-success-subtle' },
      { name: 'Warning', class: 'bg-warning' },
      { name: 'Warning Hover', class: 'bg-warning-hover' },
      { name: 'Warning Subtle', class: 'bg-warning-subtle' },
      { name: 'Info', class: 'bg-info' },
      { name: 'Info Hover', class: 'bg-info-hover' },
    ],
    'On Colors': [
      { name: 'On Primary', class: 'bg-on-primary' },
      { name: 'On Accent', class: 'bg-on-accent' },
      { name: 'On Destructive', class: 'bg-on-destructive' },
      { name: 'On Success', class: 'bg-on-success' },
      { name: 'On Warning', class: 'bg-on-warning' },
      { name: 'On Info', class: 'bg-on-info' },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Color Palette</h1>
          <p className="text-muted mt-2">Tailwind CSS v4 • WCAG 2.2 AA Compliant</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {Object.entries(colorGroups).map(([category, colors]) => (
          <div
            key={category}
            className="bg-card rounded-xl p-6 border border-border transition-colors duration-300"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">{category}</h2>
            <div className="space-y-4">
              {colors.map(({ name, class: className }) => (
                <div key={name} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg border border-border-subtle ${className} transition-colors duration-300`}
                  />
                  <div>
                    <p className="text-foreground font-medium text-sm">{name}</p>
                    <p className="text-muted text-xs font-mono">{className}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
