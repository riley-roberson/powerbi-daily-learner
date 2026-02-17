export type Tier = "foundation" | "builder" | "architect";

export interface DayInfo {
  day: number;
  tier: Tier;
  title: string;
  conceptTopic: string;
  daxFocus: string;
  concepts: string[];
}

export const curriculum: DayInfo[] = [
  // Foundation Tier — Days 1–10: Data Modeling & Core DAX
  { day: 1, tier: "foundation", title: "Star Schema Fundamentals", conceptTopic: "Star schema vs flat tables", daxFocus: "SUM() and COUNTROWS()", concepts: ["star schema", "fact tables", "dimension tables", "SUM", "COUNTROWS"] },
  { day: 2, tier: "foundation", title: "Relationship Types & Cardinality", conceptTopic: "One-to-many, many-to-many, bi-directional", daxFocus: "DISTINCTCOUNT() and CROSSFILTER()", concepts: ["cardinality", "cross-filter direction", "DISTINCTCOUNT", "CROSSFILTER"] },
  { day: 3, tier: "foundation", title: "The Date Table", conceptTopic: "Why every model needs a proper date table", daxFocus: "TOTALYTD() and DATESYTD()", concepts: ["date table", "TOTALYTD", "DATESYTD", "auto date/time"] },
  { day: 4, tier: "foundation", title: "Calculated Columns vs Measures", conceptTopic: "Row context vs filter context", daxFocus: "DIVIDE() and calculated columns", concepts: ["calculated columns", "measures", "row context", "DIVIDE"] },
  { day: 5, tier: "foundation", title: "Filter Context Deep Dive", conceptTopic: "How filter context flows through relationships", daxFocus: "ALL() for percent of total", concepts: ["filter context", "CALCULATE", "ALL", "% of total"] },
  { day: 6, tier: "foundation", title: "Row Context & EARLIER", conceptTopic: "Row context in calculated columns", daxFocus: "EARLIER() and FILTER()", concepts: ["row context", "EARLIER", "FILTER", "COUNTROWS"] },
  { day: 7, tier: "foundation", title: "Variables in DAX", conceptTopic: "VAR/RETURN for readability and performance", daxFocus: "Refactoring with VAR/RETURN", concepts: ["VAR", "RETURN", "DIVIDE", "readability"] },
  { day: 8, tier: "foundation", title: "Inactive Relationships", conceptTopic: "Role-playing dimensions with USERELATIONSHIP()", daxFocus: "CALCULATE() + USERELATIONSHIP()", concepts: ["inactive relationships", "USERELATIONSHIP", "CALCULATE", "role-playing dimensions"] },
  { day: 9, tier: "foundation", title: "Data Categories & Formatting", conceptTopic: "Geo categories, format strings, display folders", daxFocus: "FORMAT() and conditional display", concepts: ["data categories", "FORMAT", "display folders", "IF"] },
  { day: 10, tier: "foundation", title: "Foundation Capstone", conceptTopic: "Model validation and audit", daxFocus: "Sales vs Target Variance", concepts: ["model audit", "SalesTargets", "DIVIDE", "VAR/RETURN"] },

  // Builder Tier — Days 11–20: Intermediate DAX Patterns & Visualization
  { day: 11, tier: "builder", title: "CALCULATE & Context Transition", conceptTopic: "How CALCULATE modifies filter context", daxFocus: "% of Total and % of Parent", concepts: ["CALCULATE", "ALL", "ALLEXCEPT", "context transition"] },
  { day: 12, tier: "builder", title: "Time Intelligence Patterns", conceptTopic: "YTD, QTD, MTD, same period last year", daxFocus: "SAMEPERIODLASTYEAR and YoY Growth", concepts: ["SAMEPERIODLASTYEAR", "TOTALYTD", "TOTALMTD", "YoY Growth"] },
  { day: 13, tier: "builder", title: "Iterator Functions", conceptTopic: "SUMX, AVERAGEX, MAXX row-by-row evaluation", daxFocus: "Weighted average and MAXX()", concepts: ["SUMX", "AVERAGEX", "MAXX", "iterators"] },
  { day: 14, tier: "builder", title: "Conditional Logic in DAX", conceptTopic: "IF, SWITCH, COALESCE, IFERROR", daxFocus: "SWITCH(TRUE()) for customer tiers", concepts: ["IF", "SWITCH", "TRUE", "COALESCE", "IFERROR"] },
  { day: 15, tier: "builder", title: "Table Functions", conceptTopic: "FILTER, ALL, VALUES, ADDCOLUMNS, TOPN", daxFocus: "Top 5 Products with TOPN()", concepts: ["FILTER", "VALUES", "TOPN", "ADDCOLUMNS"] },
  { day: 16, tier: "builder", title: "Dynamic Segmentation", conceptTopic: "Disconnected tables and SELECTEDVALUE()", daxFocus: "Dynamic metric selector", concepts: ["disconnected tables", "SELECTEDVALUE", "SWITCH", "what-if"] },
  { day: 17, tier: "builder", title: "Ranking & TopN Patterns", conceptTopic: "RANKX, TOPN, dynamic ranking", daxFocus: "RANKX() and dynamic Top N", concepts: ["RANKX", "TOPN", "ALL", "ISINSCOPE"] },
  { day: 18, tier: "builder", title: "Semi-Additive Measures", conceptTopic: "Snapshot measures: LASTDATE, LASTNONBLANK", daxFocus: "Ending inventory and opening balance", concepts: ["LASTDATE", "LASTNONBLANK", "OPENINGBALANCEYEAR", "semi-additive"] },
  { day: 19, tier: "builder", title: "Visualization Best Practices", conceptTopic: "Chart selection, data-ink ratio, accessibility", daxFocus: "Conditional formatting measures", concepts: ["chart types", "conditional formatting", "KPI colors", "accessibility"] },
  { day: 20, tier: "builder", title: "Builder Capstone", conceptTopic: "Complete dashboard page design", daxFocus: "Full dashboard metric set", concepts: ["dashboard", "SAMEPERIODLASTYEAR", "RANKX", "DIVIDE", "VAR/RETURN"] },

  // Architect Tier — Days 21–30: Advanced DAX, Optimization & Governance
  { day: 21, tier: "architect", title: "Many-to-Many Relationships", conceptTopic: "Bridge tables and TREATAS()", daxFocus: "TREATAS() for virtual relationships", concepts: ["many-to-many", "TREATAS", "bridge tables", "CALCULATE"] },
  { day: 22, tier: "architect", title: "Calculation Groups", conceptTopic: "Reusable time intelligence", daxFocus: "SELECTEDMEASURE() calculation items", concepts: ["calculation groups", "SELECTEDMEASURE", "TOTALYTD", "SAMEPERIODLASTYEAR"] },
  { day: 23, tier: "architect", title: "Advanced Time Intelligence", conceptTopic: "Rolling periods and custom fiscal calendars", daxFocus: "DATESINPERIOD() rolling 12 months", concepts: ["DATESINPERIOD", "PARALLELPERIOD", "rolling 12M", "fiscal YTD"] },
  { day: 24, tier: "architect", title: "Row-Level Security (RLS)", conceptTopic: "Static and dynamic RLS", daxFocus: "USERPRINCIPALNAME() + LOOKUPVALUE()", concepts: ["RLS", "USERPRINCIPALNAME", "LOOKUPVALUE", "dynamic security"] },
  { day: 25, tier: "architect", title: "Performance Optimization", conceptTopic: "DAX Studio, VertiPaq, query reduction", daxFocus: "Rewriting slow measures with VAR", concepts: ["VertiPaq", "KEEPFILTERS", "VAR", "performance"] },
  { day: 26, tier: "architect", title: "Parent-Child Hierarchies", conceptTopic: "PATH functions for org charts", daxFocus: "PATH(), PATHITEM(), PATHLENGTH()", concepts: ["PATH", "PATHITEM", "PATHLENGTH", "LOOKUPVALUE"] },
  { day: 27, tier: "architect", title: "Advanced Filtering Patterns", conceptTopic: "KEEPFILTERS, REMOVEFILTERS, ALLSELECTED", daxFocus: "ALLSELECTED() and REMOVEFILTERS()", concepts: ["ALLSELECTED", "REMOVEFILTERS", "KEEPFILTERS", "CALCULATE"] },
  { day: 28, tier: "architect", title: "Power BI Service & Deployment", conceptTopic: "Workspaces, deployment pipelines, dataflows", daxFocus: "What-if parameters with GENERATESERIES()", concepts: ["workspaces", "deployment", "SELECTEDVALUE", "GENERATESERIES"] },
  { day: 29, tier: "architect", title: "Composite Models & DirectQuery", conceptTopic: "Import vs DirectQuery vs Dual", daxFocus: "ISFILTERED() for smart aggregation", concepts: ["DirectQuery", "composite models", "ISFILTERED", "aggregation tables"] },
  { day: 30, tier: "architect", title: "Architect Capstone", conceptTopic: "Production-ready Power BI solution", daxFocus: "Executive KPI card set", concepts: ["TOTALYTD", "SAMEPERIODLASTYEAR", "RANKX", "DIVIDE", "VAR/RETURN"] },
];

export function getDayInfo(day: number): DayInfo | undefined {
  return curriculum.find((d) => d.day === day);
}

export function tierColor(tier: Tier): string {
  switch (tier) {
    case "foundation": return "text-[#1b365d]";
    case "builder":    return "text-[#487a7b]";
    case "architect":  return "text-[#e87722]";
  }
}

export function tierBg(tier: Tier): string {
  switch (tier) {
    case "foundation": return "bg-[#1b365d]/20 border-[#1b365d]";
    case "builder":    return "bg-[#487a7b]/20 border-[#487a7b]";
    case "architect":  return "bg-[#e87722]/20 border-[#e87722]";
  }
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case "foundation": return "Foundation";
    case "builder":    return "Builder";
    case "architect":  return "Architect";
  }
}
