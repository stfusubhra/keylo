import React from 'react';

/**
 * ResponsiveTable
 * Renders a real table on md+ screens and stacked, labeled cards on mobile.
 *
 * Usage — same children shape as a plain table body:
 *   <ResponsiveTable headers={['Tenant', 'Email', 'Status']} bordered bleed>
 *     {rows.map((row) => (
 *       <tr key={row.id}>
 *         <td className="px-md py-sm text-primary">{row.name}</td>
 *         <td className="px-md py-sm text-on-surface-variant">{row.email}</td>
 *         <td className="px-md py-sm"><Status value={row.status} /></td>
 *       </tr>
 *     ))}
 *   </ResponsiveTable>
 *
 * Props:
 *   headers  – array of column labels (strings).
 *   children – <tr> elements with one <td> per column.
 *   empty    – message shown when no rows are present.
 *   bordered – wraps the desktop table in a `border-2 border-primary` box.
 *   bleed    – extends the mobile/desktop box to the screen edges on mobile
 *              (`-mx-4 px-4`), matching the old admin-table full-bleed look.
 */
export default function ResponsiveTable({ headers, children, empty = 'No records found.', bordered = false, bleed = false }) {
  const rows = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === 'tr'
  );
  const boxClass = bordered ? 'border-2 border-primary' : '';
  const bleedClass = bleed ? '-mx-4 px-4 sm:mx-0 sm:px-0' : '';

  const desktopTable = (
    <div className={`hidden md:block overflow-x-auto ${boxClass} ${bleedClass}`}>
      <table className="w-full text-left min-w-[500px] sm:min-w-0">
        <thead className="bg-primary text-on-primary">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-md py-sm font-label-caps text-[10px] uppercase whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            children
          ) : (
            <tr><td colSpan={headers.length} className="px-md py-lg text-on-surface-variant">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const mobileCards = (
    <div className={`md:hidden flex flex-col gap-md ${bleedClass}`}>
      {rows.length > 0 ? (
        rows.map((row, rowIndex) => {
          const cells = React.Children.toArray(row.props.children).filter(
            (cell) => React.isValidElement(cell) && cell.type === 'td'
          );
          return (
            <div key={row.key ?? rowIndex} className="border-2 border-primary bg-surface-container-lowest">
              {cells.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`px-md py-sm ${cellIndex < cells.length - 1 ? 'border-b-2 border-primary/20' : ''}`}
                >
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs">
                    {headers[cellIndex] || ''}
                  </p>
                  <div>{cell.props.children}</div>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <div className="border-2 border-primary px-md py-lg text-on-surface-variant">{empty}</div>
      )}
    </div>
  );

  return (
    <>
      {desktopTable}
      {mobileCards}
    </>
  );
}
