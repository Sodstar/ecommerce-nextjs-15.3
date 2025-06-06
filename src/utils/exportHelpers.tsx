"use client";

/**
 * Generate a PDF from tabular data using the browser print functionality.
 * This approach ensures proper UTF-8 character support for Mongolian text.
 */
export function exportToPDF<T extends Record<string, any>>({
  data,
  columns,
  title,
  filename,
}: {
  data: T[];
  columns: { header: string; accessor: keyof T | string }[];
  title: string;
  filename?: string;
}) {
  // Create a temporary HTML table for better UTF-8 support
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Та popup зөвшөөрнө үү");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding:10px;
            font-size: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin:10px 0; 
             font-size: 12px;
          }
          th, td { 
            padding: 2px; 
            text-align: left; 
            border: 1px solid #ddd; 
             font-size: 12px;
          }
          th { 
            background-color: #f2f2f2; 
             font-size: 12px;
          }
          h1 { 
            text-align: center; 
          }
          .print-footer { 
            text-align: center; 
            margin-top: 20px; 
            font-size: 10px; 
          }
          @media print {
            .no-print { 
              display: none; 
            }
            button { 
              display: none; 
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="no-print" style="text-align: center; margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            PDF хадгалах / Хэвлэх
          </button>
        </div>
        <table>
          <thead>
            <tr>
              ${columns.map((column) => `<th>${column.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                ${columns
                  .map((column) => {
                    const value = item[column.accessor as keyof typeof item];
                    return `<td>${
                      value !== undefined && value !== null ? value : ""
                    }</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="print-footer">
          Хэвлэсэн огноо: ${new Date().toLocaleString("mn-MN")}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
}

/**
 * Export data to Excel file
 */
export function exportToExcel<T extends Record<string, any>>(
  _unused1: any = null,
  _unused2: any = null,
  {
    data,
    columns,
    filename = "exported-data",
    sheetName = "Sheet1",
  }: {
    data: T[];
    columns: { header: string; accessor: keyof T | string }[];
    filename?: string;
    sheetName?: string;
  }
) {
  // Dynamically import XLSX to avoid SSR issues
  import("xlsx").then((XLSX) => {
    const workbook = XLSX.utils.book_new();

    const excelData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((column) => {
        row[column.header] = item[column.accessor as keyof typeof item];
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  });
}
