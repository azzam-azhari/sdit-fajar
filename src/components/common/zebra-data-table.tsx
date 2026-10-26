import * as React from "react";
import { cn } from "@/lib/utils";

export interface ZebraColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  isMono?: boolean;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

export interface ZebraDataTableProps<T> {
  data: T[];
  columns: ZebraColumn<T>[];
  keyExtractor?: (item: T, index: number) => string | number;
  caption?: string;
  emptyText?: string;
  className?: string;
}

export function ZebraDataTable<T>({
  data,
  columns,
  keyExtractor,
  caption,
  emptyText = "Belum ada data tersedia.",
  className,
}: ZebraDataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border bg-card shadow-xs",
        className
      )}
    >
      <table className="w-full text-left text-sm border-collapse">
        {caption && (
          <caption className="py-2 px-4 text-xs text-muted-foreground text-left italic border-b border-border/50">
            {caption}
          </caption>
        )}
        <thead className="bg-muted/60 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border select-none">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={cn(
                  "py-3 px-4 font-semibold text-xs",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 px-4 text-center text-xs text-muted-foreground"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const rowKey = keyExtractor
                ? keyExtractor(item, rowIndex)
                : rowIndex;
              return (
                <tr
                  key={rowKey}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    rowIndex % 2 === 0
                      ? "bg-background"
                      : "bg-muted/25 dark:bg-muted/15"
                  )}
                >
                  {columns.map((col, colIndex) => {
                    const content = col.cell
                      ? col.cell(item, rowIndex)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "-")
                      : null;

                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "py-3 px-4 text-xs text-foreground/90 align-middle",
                          col.isMono && "font-mono text-xs tracking-tight",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          col.className
                        )}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
