import React from "react"

const DataTable = ({ columns = [], rows = [], rowKey, onRowClick, emptyText = "No records available." }) => {
  if (!rows.length) {
    return (
      <div className="p-6 text-sm text-ca-text-muted text-center border-t border-ca-divider">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-ca-bg text-[11px] uppercase tracking-wider text-ca-text-muted border-b border-ca-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3.5 font-semibold whitespace-nowrap ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ca-divider">
          {rows.map((row, idx) => {
            const key = typeof rowKey === "function" ? rowKey(row) : row[rowKey] ?? idx
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`${
                  onRowClick ? "cursor-pointer hover:bg-ca-surface-raised" : ""
                } transition-colors`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3.5 ${col.align === "right" ? "text-right" : "text-left"} ${
                      col.cellClassName || ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
