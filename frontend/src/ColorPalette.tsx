/* filepath: src/ColorPalette.tsx */

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
    <div className="min-h-screen bg-background p-8 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-foreground">Color Palette</h1>
          <p className="text-muted mt-2">Tailwind CSS v4 • WCAG 2.2 AA Compliant</p>
        </div>
      </div>

      {/* Typography Section */}
      <section className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-foreground mb-8">Typography</h2>
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="text-foreground">Heading 1 — 48px/56px</h1>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-foreground">Heading 2 — 40px/48px</h2>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <h3 className="text-foreground">Heading 3 — 33px/40px</h3>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <h4 className="text-foreground">Heading 4 — 28px/36px</h4>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <h5 className="text-foreground">Heading 5 — 23px/32px</h5>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <h6 className="text-foreground">Heading 6 — 19px/28px</h6>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <p className="text-foreground">Body Default — 16px/24px</p>
          </div>
          <div>
            <small className="text-foreground">Body Small — 14px/20px</small>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <h2 className="text-foreground mb-8">Colors</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {Object.entries(colorGroups).map(([category, colors]) => (
          <div key={category} className="bg-card rounded-xl p-6 border border-border duration-300">
            <h4 className="text-foreground mb-6">{category}</h4>
            <div className="space-y-4">
              {colors.map(({ name, class: className }) => (
                <div key={name} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg border border-border-subtle ${className} duration-300`}
                  />
                  <div>
                    <p className="text-foreground font-medium">{name}</p>
                    <small className="text-muted font-mono">{className}</small>
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
