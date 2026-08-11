import { Link } from 'react-router-dom';

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-h1 text-h1 text-primary mb-md">Accessibility Statement</h1>
      <p className="font-body-lg text-body-lg text-on-surface mb-lg">
        KeyLo is committed to ensuring digital accessibility for all users, including those with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
      </p>
      <h2 className="font-h3 text-h3 text-primary mb-md">Our Efforts</h2>
      <ul className="list-disc pl-6 mb-lg">
        <li className="font-body-md text-body-md text-on-surface mb-sm">
          All interactive elements are navigable via keyboard.
        </li>
        <li className="font-body-md text-body-md text-on-surface mb-sm">
          Screen reader compatibility with descriptive aria-labels and semantic HTML.
        </li>
        <li className="font-body-md text-body-md text-on-surface mb-sm">
          Sufficient color contrast for text and UI components.
        </li>
        <li className="font-body-md text-body-md text-on-surface mb-sm">
          Clear focus indicators for interactive elements.
        </li>
        <li className="font-body-md text-body-md text-on-surface mb-sm">
          Accessible forms with explicit labels and error messages.
        </li>
      </ul>
      <h2 className="font-h3 text-h3 text-primary mb-md">Known Limitations</h2>
      <p className="font-body-md text-body-md text-on-surface mb-sm">
        While we work to improve accessibility, some third-party components may not fully meet our standards. We're actively addressing these issues.
      </p>
      <h2 className="font-h3 text-h3 text-primary mb-md">Provide Feedback</h2>
      <p className="font-body-md text-body-md text-on-surface mb-sm">
        If you encounter accessibility barriers, please contact us at <a href="mailto:accessibility@keylo.in" className="text-primary hover:underline">accessibility@keylo.in</a>. Include the specific page URL and a description of the issue.
      </p>
      <p className="font-body-md text-body-md text-on-surface mt-md">
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </p>
    </div>
  );
}