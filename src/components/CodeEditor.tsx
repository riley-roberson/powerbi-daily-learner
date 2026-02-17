"use client";

import { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

const DAX_KEYWORDS = [
  "CALCULATE", "FILTER", "ALL", "ALLEXCEPT", "ALLSELECTED", "VALUES", "DISTINCT",
  "SUMX", "AVERAGEX", "MAXX", "MINX", "COUNTX", "COUNTROWS", "DIVIDE",
  "IF", "SWITCH", "VAR", "RETURN", "TRUE", "FALSE", "BLANK",
  "TOTALYTD", "TOTALMTD", "TOTALQTD", "DATESYTD", "DATESMTD",
  "SAMEPERIODLASTYEAR", "DATESINPERIOD", "DATEADD", "PARALLELPERIOD",
  "TOPN", "RANKX", "TREATAS", "USERELATIONSHIP", "CROSSFILTER",
  "SELECTEDVALUE", "HASONEVALUE", "ISFILTERED", "ISCROSSFILTERED",
  "KEEPFILTERS", "REMOVEFILTERS", "EARLIER", "EARLIEST",
  "PATH", "PATHITEM", "PATHLENGTH", "LOOKUPVALUE", "RELATED", "RELATEDTABLE",
  "ADDCOLUMNS", "SUMMARIZE", "GENERATESERIES", "CALENDAR", "CALENDARAUTO",
  "LASTDATE", "LASTNONBLANK", "FIRSTDATE", "FIRSTNONBLANK",
  "OPENINGBALANCEYEAR", "CLOSINGBALANCEYEAR",
  "IFERROR", "COALESCE", "FORMAT", "UNICHAR",
  "SUM", "AVERAGE", "MIN", "MAX", "COUNT", "DISTINCTCOUNT",
  "SELECTEDMEASURE", "ISINSCOPE",
  "USERPRINCIPALNAME", "USERNAME",
];

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly }: CodeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register DAX language
    monaco.languages.register({ id: "dax" });
    monaco.languages.setMonarchTokensProvider("dax", {
      ignoreCase: true,
      keywords: DAX_KEYWORDS,
      tokenizer: {
        root: [
          [/\/\/.*$/, "comment"],
          [/--.*$/, "comment"],
          [/"[^"]*"/, "string"],
          [/'[^']*'\[[^\]]*\]/, "table-column"],
          [/'[^']*'/, "table-ref"],
          [/\[[^\]]*\]/, "column-ref"],
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier",
              },
            },
          ],
          [/[0-9]+(\.[0-9]+)?/, "number"],
          [/[,()=<>+\-*/&]/, "delimiter"],
        ],
      },
    });

    monaco.editor.defineTheme("dax-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "e87722", fontStyle: "bold" },
        { token: "string", foreground: "98c379" },
        { token: "comment", foreground: "6a737d", fontStyle: "italic" },
        { token: "number", foreground: "d19a66" },
        { token: "column-ref", foreground: "5a9a9b" },
        { token: "table-ref", foreground: "5a8abf" },
        { token: "table-column", foreground: "5a9a9b" },
        { token: "delimiter", foreground: "abb2bf" },
      ],
      colors: {
        "editor.background": "#1a1d23",
        "editor.foreground": "#e5e7eb",
        "editorLineNumber.foreground": "#4b5563",
        "editorCursor.foreground": "#e87722",
        "editor.selectionBackground": "#487a7b40",
      },
    });

    monaco.editor.setTheme("dax-dark");

    // DAX completion provider
    monaco.languages.registerCompletionItemProvider("dax", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: DAX_KEYWORDS.map((kw) => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: kw,
            range,
          })),
        };
      },
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div className="monaco-container">
      <Editor
        height="300px"
        language="dax"
        theme="dax-dark"
        value={value}
        onChange={(v) => onChange(v || "")}
        onMount={handleMount}
        options={{
          readOnly: readOnly || false,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 4,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          folding: false,
        }}
      />
    </div>
  );
}
