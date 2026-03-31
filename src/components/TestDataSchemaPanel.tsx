import { TableSchema } from "@/lib/challenges";

const PURPOSE_STYLES: Record<string, string> = {
  Fact: "bg-[#1b365d]/30 text-[#5a8abf]",
  Dimension: "bg-[#487a7b]/30 text-[#7abcbd]",
  Disconnected: "bg-[#e87722]/30 text-[#f5a623]",
  Bridge: "bg-[#e87722]/30 text-[#f5a623]",
  Security: "bg-[#e87722]/30 text-[#f5a623]",
};

export default function TestDataSchemaPanel({ tables }: { tables: TableSchema[] }) {
  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 space-y-0 divide-y divide-gray-700">
      {tables.map((table, idx) => (
        <div key={idx} className={idx > 0 ? "pt-4" : ""}>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-200">{table.tableName}</h4>
            <span className={`px-2 py-0.5 text-xs rounded font-medium ${PURPOSE_STYLES[table.purpose] ?? "bg-gray-700 text-gray-300"}`}>
              {table.purpose}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3 font-mono">{table.filePath}</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-2 pr-4">Column</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col) => (
                  <tr key={col.name} className="border-t border-gray-800">
                    <td className="py-1.5 pr-4 font-mono text-xs text-gray-200">{col.name}</td>
                    <td className="py-1.5 pr-4 font-mono text-xs text-[#7abcbd]">{col.type}</td>
                    <td className="py-1.5 text-xs text-gray-400">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
