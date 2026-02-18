import { Tier } from "./curriculum";

export interface Challenge {
  day: number;
  tier: Tier;
  title: string;
  conceptLesson: string;
  conceptKeyTakeaways: string[];
  daxScenario: string;
  daxInstructions: string;
  starterCode: string;
  solution: string;
  validationRules: { type: string; value: string }[];
  expectedOutput: string;
  hints: string[];
  sampleModel: string;
  powerBINotes: string;
}

export const challenges: Challenge[] = [
  // ============================================================
  // FOUNDATION TIER — Days 1–10: Data Modeling & Core DAX
  // ============================================================
  {
    day: 1,
    tier: "foundation",
    title: "Star Schema Fundamentals",
    conceptLesson: `In Power BI, how you model your data determines everything — performance, simplicity of DAX, and the accuracy of your results. The star schema is the gold standard for analytical data models.

A star schema has a central fact table surrounded by dimension tables. The fact table stores measurable events (sales transactions, web clicks, shipments) with numeric columns like quantity and amount plus foreign keys to dimensions. Dimension tables hold descriptive attributes — product names, customer details, store locations, dates.

Why does this matter? Power BI's VertiPaq engine compresses columnar data. When your fact table has narrow rows (just keys and numbers) and your dimension tables have low-cardinality text columns, VertiPaq compresses extremely well. A flat table with everything denormalized bloats the model, slows queries, and makes DAX more complex.

In a star schema, relationships are always one-to-many from dimension to fact. Filters flow from dimension to fact naturally. This means a slicer on Product Category automatically filters Sales — no extra DAX needed. With flat tables, you'd need complex CALCULATE expressions to achieve the same thing.

The sample model for this course follows a star schema: Sales (fact) is surrounded by Products, Customers, Stores, and Calendar (dimensions). SalesTargets and Returns are additional fact tables.`,
    conceptKeyTakeaways: [
      "Star schemas separate facts (events + measures) from dimensions (descriptive attributes)",
      "VertiPaq compresses star schemas far better than flat/denormalized tables",
      "Relationships flow one-to-many from dimension to fact, enabling automatic filter propagation",
      "Keep fact tables narrow (keys + numbers) and dimension tables descriptive",
    ],
    daxScenario: "The sales manager wants a simple dashboard showing total revenue and order count. You need to create the two most fundamental measures in any Power BI model.",
    daxInstructions: `Write two measures:
1. Total Sales — sum of all sales amounts
2. Total Orders — count of all sales transactions`,
    starterCode: `// Measure 1: Total Sales
// Sum the TotalAmount column from the Sales table
Total Sales =

// Measure 2: Total Orders
// Count the number of rows in the Sales table
Total Orders =
`,
    solution: `Total Sales = SUM(Sales[TotalAmount])

Total Orders = COUNTROWS(Sales)`,
    validationRules: [
      { type: "contains", value: "SUM" },
      { type: "contains", value: "Sales[TotalAmount]" },
      { type: "contains", value: "COUNTROWS" },
      { type: "contains", value: "Sales" },
    ],
    expectedOutput: `Total Sales: $4,250,000 (sum of all TotalAmount values)
Total Orders: 15,000 (count of rows in Sales table)`,
    hints: [
      "SUM(TableName[ColumnName]) adds up all values in a column",
      "COUNTROWS(TableName) counts the number of rows in a table",
      "These are aggregation functions — they respect filter context from slicers and visuals",
      "Measures are defined with: MeasureName = expression",
    ],
    sampleModel: "Sales[TotalAmount] contains the dollar amount per transaction. Each row in Sales is one order line.",
    powerBINotes: "In Power BI Desktop, create measures by right-clicking the Sales table → New Measure. Always prefer measures over calculated columns for aggregations.",
  },
  {
    day: 2,
    tier: "foundation",
    title: "Relationship Types & Cardinality",
    conceptLesson: `Every connection between tables in Power BI has two properties: cardinality (one-to-one, one-to-many, or many-to-many) and cross-filter direction (single or both).

One-to-many is the standard and ideal relationship. The dimension table (one side) filters the fact table (many side). When you put Product Category on a slicer, the filter flows through the relationship to show only matching sales. This is the natural direction.

Many-to-many relationships occur when neither side has unique values for the join column. For example, if multiple budget rows exist per product AND multiple sales rows exist per product, that's many-to-many. Power BI handles these but they can produce unexpected results if not managed carefully.

Bi-directional cross-filtering makes the filter flow both ways — from fact to dimension AND dimension to fact. This sounds powerful but is dangerous: it can cause ambiguous filter paths, performance degradation, incorrect results due to circular dependencies, and it makes the model harder to reason about. Avoid setting bi-directional on the relationship itself. If you need reverse filtering for a specific calculation, use CROSSFILTER() inside a measure — this limits the effect to that one measure rather than affecting the entire model.

The CROSSFILTER function lets you override the default cross-filter direction inside a specific measure, without changing the model relationship permanently. This is safer than setting bi-directional on the relationship itself.`,
    conceptKeyTakeaways: [
      "One-to-many (dimension to fact) is the default and preferred relationship type",
      "Filters flow from the 'one' side to the 'many' side by default",
      "Bi-directional filtering is risky — prefer CROSSFILTER() in specific measures instead",
      "Many-to-many relationships require careful handling (bridge tables or TREATAS)",
    ],
    daxScenario: "Marketing wants to know how many unique customers purchased products, and a reverse analysis showing how many products each customer region buys.",
    daxInstructions: `Write two measures:
1. Active Customers — count of distinct customers in the Sales table
2. Products per Region — use CROSSFILTER to count products filtering through Sales`,
    starterCode: `// Measure 1: Active Customers
// Count distinct customer IDs from the Sales table
Active Customers =

// Measure 2: Products per Region
// Count distinct products, using CROSSFILTER to enable
// filtering from Customers through Sales to Products
Products per Region =
`,
    solution: `Active Customers = DISTINCTCOUNT(Sales[CustomerID])

Products per Region =
CALCULATE(
    DISTINCTCOUNT(Sales[ProductID]),
    CROSSFILTER(Sales[CustomerID], Customers[CustomerID], Both)
)`,
    validationRules: [
      { type: "contains", value: "DISTINCTCOUNT" },
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "CROSSFILTER" },
    ],
    expectedOutput: `Active Customers: 1,250 (unique customers who made purchases)
Products per Region: varies by region — e.g., West: 85, East: 92`,
    hints: [
      "DISTINCTCOUNT(column) counts unique values, ignoring duplicates",
      "CROSSFILTER(column1, column2, direction) overrides the relationship direction",
      "Direction options: None, OneWay, Both",
      "Wrap CROSSFILTER inside CALCULATE as a filter modifier",
    ],
    sampleModel: "Sales[CustomerID] → Customers[CustomerID] (many-to-one). Sales[ProductID] → Products[ProductID] (many-to-one).",
    powerBINotes: "In Model view, double-click a relationship line to see its cardinality and cross-filter direction. Avoid changing these globally — use CROSSFILTER() in measures instead.",
  },
  {
    day: 3,
    tier: "foundation",
    title: "The Date Table",
    conceptLesson: `Time intelligence is one of Power BI's most powerful features, but it requires a proper date table. Without one, functions like TOTALYTD, SAMEPERIODLASTYEAR, and DATESINPERIOD simply won't work correctly.

A proper date table must meet three requirements: (1) It must contain a contiguous range of dates — every single day between the earliest and latest dates in your data, with no gaps. (2) It must have a column with unique date values (the Date column). (3) It must be marked as a date table in Power BI (Table tools → Mark as date table).

Power BI's "Auto date/time" feature creates hidden date tables behind every date column. This sounds helpful but causes problems: it creates multiple hidden tables (bloating the model), doesn't support fiscal calendars, and prevents proper time intelligence across related tables. Always disable it in File → Options → Data Load.

The Calendar table in our sample model has all the attributes you need: Year, Quarter, MonthNumber, MonthName, FiscalYear, FiscalQuarter, IsWeekend, and more. This single table powers all time-based analysis across every fact table.

You can create a date table in Power Query (recommended for production) or with DAX using CALENDAR() or CALENDARAUTO(). The key is that it's a first-class dimension table with a relationship to your fact table's date column.`,
    conceptKeyTakeaways: [
      "A date table must have contiguous dates, a unique date column, and be marked as a date table",
      "Disable Auto date/time — it creates hidden bloat and limits functionality",
      "One date table serves all fact tables via relationships to their date columns",
      "Time intelligence functions (TOTALYTD, SAMEPERIODLASTYEAR) require a proper date table",
    ],
    daxScenario: "Finance needs year-to-date sales figures. You need to write the YTD calculation two different ways to understand how time intelligence works under the hood.",
    daxInstructions: `Write two versions of YTD Sales:
1. Using TOTALYTD — the shorthand function
2. Using CALCULATE + DATESYTD — the expanded version (same result)`,
    starterCode: `// Version 1: YTD Sales using TOTALYTD
// TOTALYTD(expression, dates_column)
YTD Sales v1 =

// Version 2: YTD Sales using CALCULATE + DATESYTD
// CALCULATE(expression, DATESYTD(dates_column))
YTD Sales v2 =
`,
    solution: `YTD Sales v1 =
TOTALYTD(SUM(Sales[TotalAmount]), Calendar[Date])

YTD Sales v2 =
CALCULATE(
    SUM(Sales[TotalAmount]),
    DATESYTD(Calendar[Date])
)`,
    validationRules: [
      { type: "contains", value: "TOTALYTD" },
      { type: "contains", value: "DATESYTD" },
      { type: "contains", value: "CALCULATE" },
    ],
    expectedOutput: `Both measures return the same value.
For March 2024: YTD Sales = $1,125,000 (Jan + Feb + Mar cumulative)
For June 2024: YTD Sales = $2,340,000 (Jan through Jun cumulative)`,
    hints: [
      "TOTALYTD is shorthand for CALCULATE + DATESYTD — they produce identical results",
      "The dates column must come from your marked date table (Calendar[Date])",
      "DATESYTD returns the set of dates from Jan 1 to the latest date in the current filter",
      "Both versions can take an optional year-end date parameter for fiscal years",
    ],
    sampleModel: "Calendar[Date] is the date column marked as the date table. Sales[OrderDate] → Calendar[Date] is the active relationship.",
    powerBINotes: "After creating a Calendar table, go to Table tools → Mark as date table → select the Date column. This enables all time intelligence functions.",
  },
  {
    day: 4,
    tier: "foundation",
    title: "Calculated Columns vs Measures",
    conceptLesson: `This is one of the most important distinctions in Power BI. Calculated columns and measures look similar — both use DAX — but they behave completely differently.

A calculated column is computed once, at data refresh time, for every row in the table. The result is stored in the model, increasing its size. Calculated columns have row context — they can access the current row's values directly (like Products[ListPrice] - Products[UnitCost]). Use them when you need a value per row: for slicers, for row-level calculations that don't change with filters, or for columns used in relationships.

A measure is computed at query time, dynamically, based on the current filter context. It is NOT stored — it's calculated on the fly whenever a visual needs it. Measures respond to slicers, row/column groupings, and page filters. This makes them perfect for aggregations, percentages, and any value that should change as the user interacts with the report.

The rule of thumb: if the value depends on how the user slices, filters, or interacts with the report, it must be a measure. Calculated columns are appropriate in limited cases: when you need the value for slicing/filtering, when it's used in a relationship, or when it's a row-level attribute that doesn't depend on aggregation. In practice, the vast majority of your DAX should be measures — prefer measures over calculated columns whenever possible. A common mistake is creating calculated columns for values that should be measures, which wastes memory and produces incorrect results when filters change.

DIVIDE() is a best practice over using the / operator. It handles division by zero gracefully by returning BLANK (or an alternate value you specify) instead of throwing an error. Always use DIVIDE for ratios and percentages.`,
    conceptKeyTakeaways: [
      "Calculated columns: computed at refresh, stored in model, have row context, increase model size",
      "Measures: computed at query time, respond to filter context, not stored, no model size impact",
      "Use calculated columns for slicers, relationships, and static row-level values",
      "Use measures for aggregations, KPIs, and anything that should react to user filters",
      "Always use DIVIDE() instead of / for safe division",
    ],
    daxScenario: "The product team needs a profit margin on each product (static, per-product) and an average order value metric that changes with filters (dynamic, for dashboards).",
    daxInstructions: `Write one calculated column and one measure:
1. Profit Margin (calculated column on Products table) — (ListPrice - UnitCost) / ListPrice
2. Avg Order Value (measure) — Total Sales / Total Orders using DIVIDE`,
    starterCode: `// Calculated Column: Add to the Products table
// (ListPrice - UnitCost) / ListPrice
Profit Margin =

// Measure: Average Order Value
// Use DIVIDE for safe division: Total Sales / Total Orders
Avg Order Value =
`,
    solution: `Profit Margin =
DIVIDE(
    Products[ListPrice] - Products[UnitCost],
    Products[ListPrice]
)

Avg Order Value =
DIVIDE(
    SUM(Sales[TotalAmount]),
    COUNTROWS(Sales)
)`,
    validationRules: [
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "ListPrice" },
      { type: "contains", value: "UnitCost" },
      { type: "contains", value: "SUM" },
    ],
    expectedOutput: `Profit Margin: 0.35 (35%) for a product with ListPrice=100, UnitCost=65
Avg Order Value: $283.33 (Total Sales / Total Orders, changes with filters)`,
    hints: [
      "DIVIDE(numerator, denominator) returns BLANK if denominator is 0",
      "In a calculated column, you reference the current row directly: Products[ListPrice]",
      "In a measure, you must aggregate: SUM(Sales[TotalAmount])",
      "DIVIDE has an optional third parameter for alternate results: DIVIDE(a, b, 0)",
    ],
    sampleModel: "Products[ListPrice] and Products[UnitCost] are per-product values. Sales[TotalAmount] is per-transaction.",
    powerBINotes: "Create calculated columns by right-clicking a table → New Column. Create measures via New Measure. You can tell them apart in the Fields pane — measures show a calculator icon.",
  },
  {
    day: 5,
    tier: "foundation",
    title: "Filter Context Deep Dive",
    conceptLesson: `Filter context is the single most important concept in DAX. Every cell in every visual has a filter context — a set of filter conditions applied to columns of the model that determine which rows participate in a calculation.

When you place Product Category on rows and Total Sales as a value in a matrix, each row has a different filter context. The "Electronics" row has a filter on Products[Category] = "Electronics", so only matching sales rows participate. The grand total row has no category filter — all sales rows participate. Your measure doesn't change; the filter context changes.

Filter context comes from multiple sources: visual row/column headers, slicers, page-level filters, report-level filters, and CALCULATE. They all combine (intersect) to narrow down which rows participate in the calculation.

ALL() is your first tool for manipulating filter context. When used as a CALCULATE modifier, ALL(TableOrColumn) removes all filters from a table or column. This is essential for "percent of total" calculations: you need the filtered total (current context) divided by the unfiltered total (ALL removes filters). Note: in modern DAX, REMOVEFILTERS() is the preferred way to remove filters inside CALCULATE — it's semantically clearer. ALL used as a table function (returning a table) is a different concept.

The pattern DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Products))) gives you each row's percentage of the grand total. CALCULATE creates a new filter context where all filters on Products are removed, giving you the total across all products, while the numerator respects the current filter.`,
    conceptKeyTakeaways: [
      "Filter context = a set of filter conditions on columns that determine which rows participate in a calculation",
      "Every cell in a visual has a unique filter context",
      "ALL() removes filters from a table or column — essential for percentages and ratios (REMOVEFILTERS is the modern alternative)",
      "CALCULATE creates a new filter context and evaluates an expression within it",
    ],
    daxScenario: "The VP of Sales wants to see each product category's contribution as a percentage of total company revenue. The percentage should update when other slicers are applied (like date range) but always show the category's share of the visible total.",
    daxInstructions: `Write a percent of total measure:
1. Divide the current category's sales by the total sales across ALL product categories
2. Use CALCULATE + ALL to remove the category filter for the denominator
3. Use DIVIDE for safe division`,
    starterCode: `// Measure: % of Total Sales
// Numerator: [Total Sales] in the current filter context
// Denominator: [Total Sales] with ALL product filters removed
// Use DIVIDE for safe division
% of Total Sales =
`,
    solution: `% of Total Sales =
DIVIDE(
    SUM(Sales[TotalAmount]),
    CALCULATE(
        SUM(Sales[TotalAmount]),
        ALL(Products)
    )
)`,
    validationRules: [
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "ALL" },
      { type: "contains", value: "DIVIDE" },
    ],
    expectedOutput: `When viewed by Category:
Electronics: 35% ($1,487,500 / $4,250,000)
Clothing: 28%
Home & Garden: 22%
Sports: 15%
Grand Total: 100%`,
    hints: [
      "The numerator is just [Total Sales] — it naturally respects the current row's filter",
      "The denominator needs CALCULATE to modify the filter context",
      "ALL(Products) removes all filters on the Products table, giving the grand total",
      "DIVIDE handles the case where total sales is zero",
    ],
    sampleModel: "Products[Category] is the grouping column. Sales[TotalAmount] is summed. The relationship Sales[ProductID] → Products[ProductID] propagates the filter.",
    powerBINotes: "Format percentage measures as Percentage in the Modeling tab. Set decimal places to 1. This applies the % format automatically in visuals.",
  },
  {
    day: 6,
    tier: "foundation",
    title: "Row Context & EARLIER",
    conceptLesson: `Row context is different from filter context. Row context exists when DAX iterates over rows — inside calculated columns and inside iterator functions (SUMX, FILTER, AVERAGEX, etc.).

In a calculated column, DAX evaluates the expression for each row of the table. Inside that expression, you can reference the current row's column values directly: Products[ListPrice], Products[Category]. This is row context — you're "inside" a specific row.

EARLIER() is a function that references the value from an outer row context when you have nested iterations. Imagine you're in a calculated column on the Products table, and inside that expression you use FILTER(Products, ...). Now you have two row contexts — the outer one (the current row being calculated) and the inner one (the row being evaluated by FILTER). EARLIER(Products[ListPrice]) refers to the outer row's ListPrice.

While EARLIER works, modern DAX best practice strongly favors VAR instead. You capture the outer value in a variable before entering the inner iteration: VAR CurrentPrice = Products[ListPrice]. Inside the FILTER, you compare against CurrentPrice instead of using EARLIER. This is not just clearer — it's the recommended pattern because VARs are easier to debug, extend, and understand at a glance.

Understanding EARLIER is still important because you'll encounter it in existing models and older code. However, for any new DAX you write, always prefer the VAR approach.`,
    conceptKeyTakeaways: [
      "Row context = iterating over rows one at a time (calculated columns, SUMX, FILTER)",
      "EARLIER() references the outer row context in nested iterations",
      "Modern DAX prefers VAR to capture values before entering nested iterations",
      "Filter context and row context are independent — CALCULATE bridges them (context transition)",
    ],
    daxScenario: "The product team wants to rank each product within its category by ListPrice, without using RANKX (which is a measure-oriented function). This rank should be a calculated column stored on each product row.",
    daxInstructions: `Write a calculated column on the Products table:
1. For each product, count how many products in the SAME category have a ListPrice >= the current product's ListPrice
2. Use COUNTROWS + FILTER + EARLIER to reference the current row from inside FILTER`,
    starterCode: `// Calculated Column on Products table: Category Rank by Price
// Count products in the same category with price >= current price
// This gives a dense rank (1 = highest price in category)
Category Rank by Price =
`,
    solution: `Category Rank by Price =
COUNTROWS(
    FILTER(
        Products,
        Products[Category] = EARLIER(Products[Category])
            && Products[ListPrice] >= EARLIER(Products[ListPrice])
    )
)`,
    validationRules: [
      { type: "contains", value: "COUNTROWS" },
      { type: "contains", value: "FILTER" },
      { type: "contains", value: "EARLIER" },
    ],
    expectedOutput: `For Electronics category (sorted by price):
Laptop Pro: Rank 1 (highest price)
Tablet X: Rank 2
Earbuds: Rank 3 (lowest price in category)`,
    hints: [
      "FILTER(Products, condition) iterates over all products and returns matching rows",
      "Inside FILTER, Products[Category] refers to the inner row being tested",
      "EARLIER(Products[Category]) refers to the outer row (the one being calculated)",
      "COUNTROWS counts how many products passed the filter — that's the rank",
    ],
    sampleModel: "Products[Category], Products[ListPrice], Products[ProductName]. Each product has one category and one list price.",
    powerBINotes: "Calculated columns are computed during data refresh and stored in the model. For large tables, prefer measure-based ranking with RANKX instead.",
  },
  {
    day: 7,
    tier: "foundation",
    title: "Variables in DAX",
    conceptLesson: `VAR and RETURN are among the most important DAX constructs. They improve readability, prevent repeated calculations, and help you reason about filter context.

The syntax is: VAR VariableName = expression ... RETURN final_expression. You can define multiple VARs, and each can reference previously defined VARs. The RETURN keyword marks the final expression that the measure evaluates to.

Performance benefit: without VAR, if you reference [Total Sales] three times in a measure, the engine evaluates it three times. With VAR TotalSales = [Total Sales], it's evaluated once and reused. For complex measures, this can make a significant difference.

Context capture: VARs are evaluated in the filter context where they are defined, not where they are referenced. This is critical. If you define VAR CurrentSales = [Total Sales] and then use CALCULATE to change the filter context in the RETURN expression, CurrentSales still holds the value from the original context. This makes VARs perfect for "before and after" comparisons — capture the "before" value in a VAR, change the context with CALCULATE, and compare.

Style guideline: name your VARs descriptively. VAR TotalRevenue is better than VAR x. Think of each VAR as a named step in a calculation. Reading the RETURN statement should tell you the formula, and reading the VARs should tell you what each component means.`,
    conceptKeyTakeaways: [
      "VAR/RETURN improves readability — each VAR is a named step in the calculation",
      "VARs are evaluated once and reused — better performance than repeated sub-expressions",
      "VARs capture filter context at definition time, not at usage time",
      "Multiple VARs can reference each other in order — build up complex calculations step by step",
    ],
    daxScenario: "Finance needs a profit percentage measure. The calculation requires total revenue and total cost, which are used in both the numerator and denominator. Write it cleanly with variables.",
    daxInstructions: `Write the Profit % measure using VAR/RETURN:
1. VAR TotalRevenue = sum of sales amounts
2. VAR TotalCost = sum of (quantity * unit cost) using SUMX + RELATED
3. RETURN DIVIDE(TotalRevenue - TotalCost, TotalRevenue)`,
    starterCode: `// Measure: Profit %
// Step 1: Calculate total revenue
// Step 2: Calculate total cost (use SUMX to iterate Sales,
//         multiply Quantity by RELATED product unit cost)
// Step 3: Return profit percentage
Profit % =
`,
    solution: `Profit % =
VAR TotalRevenue = SUM(Sales[TotalAmount])
VAR TotalCost =
    SUMX(
        Sales,
        Sales[Quantity] * RELATED(Products[UnitCost])
    )
RETURN
DIVIDE(TotalRevenue - TotalCost, TotalRevenue)`,
    validationRules: [
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "SUM" },
    ],
    expectedOutput: `Profit %: 0.38 (38%) overall
By category: Electronics 42%, Clothing 35%, Home & Garden 33%
Changes dynamically with date and store filters`,
    hints: [
      "VAR TotalRevenue = SUM(Sales[TotalAmount]) captures total revenue",
      "SUMX iterates each Sales row; RELATED() looks up the product's UnitCost",
      "DIVIDE(TotalRevenue - TotalCost, TotalRevenue) gives the margin",
      "Without VAR, you'd compute TotalRevenue twice (numerator and denominator)",
    ],
    sampleModel: "Sales[TotalAmount], Sales[Quantity]. Products[UnitCost] accessed via RELATED() through the Sales→Products relationship.",
    powerBINotes: "You can debug VAR values using the Performance Analyzer in Power BI Desktop. Run the visual query and inspect the DAX in DAX Studio.",
  },
  {
    day: 8,
    tier: "foundation",
    title: "Inactive Relationships",
    conceptLesson: `In many data models, two tables need more than one relationship. A classic example: the Sales table has both OrderDate and ShipDate, both linking to the Calendar table. But Power BI only allows ONE active relationship between any two tables.

The active relationship is the default — it filters automatically. The inactive relationships exist in the model but are dormant. They're shown as dashed lines in the Model view.

USERELATIONSHIP() activates a specific inactive relationship inside a CALCULATE expression. The syntax is: CALCULATE(expression, USERELATIONSHIP(column1, column2)). This temporarily tells Power BI to use that relationship instead of the active one.

In our sample model, Sales[OrderDate] → Calendar[Date] is the active relationship. Returns[ReturnDate] → Calendar[Date] is inactive. When you want to analyze returns by their return date (not by the original order date), you need USERELATIONSHIP.

A key rule: USERELATIONSHIP must reference both the foreign key column and the primary key column of the relationship, exactly as defined in the model. It only works inside CALCULATE.`,
    conceptKeyTakeaways: [
      "Only one relationship between two tables can be active — the rest are inactive (dashed lines)",
      "USERELATIONSHIP() activates an inactive relationship inside CALCULATE",
      "Common scenario: role-playing date dimension (OrderDate, ShipDate, ReturnDate all link to Calendar)",
      "The function takes both columns of the relationship as arguments",
    ],
    daxScenario: "The returns team wants to see refund amounts organized by the date the return was processed (ReturnDate), not the original order date. Since Returns[ReturnDate] → Calendar[Date] is inactive, you need USERELATIONSHIP.",
    daxInstructions: `Write a measure that calculates total refund amount using the inactive relationship between Returns[ReturnDate] and Calendar[Date]:
1. Use CALCULATE to modify the filter context
2. Use USERELATIONSHIP to activate the Returns[ReturnDate] → Calendar[Date] relationship`,
    starterCode: `// Measure: Returns by Return Date
// Calculate total refund amount using the INACTIVE relationship
// Returns[ReturnDate] -> Calendar[Date]
Returns by Return Date =
`,
    solution: `Returns by Return Date =
CALCULATE(
    SUM(Returns[RefundAmount]),
    USERELATIONSHIP(Returns[ReturnDate], Calendar[Date])
)`,
    validationRules: [
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "USERELATIONSHIP" },
      { type: "contains", value: "Returns[ReturnDate]" },
      { type: "contains", value: "Calendar[Date]" },
    ],
    expectedOutput: `Returns by Return Date shown by month:
Jan 2024: $12,500
Feb 2024: $8,300
Mar 2024: $15,200
(Values reflect when returns were processed, not when the original sale occurred)`,
    hints: [
      "USERELATIONSHIP goes inside CALCULATE as a filter argument",
      "Specify both columns: the foreign key (Returns[ReturnDate]) and primary key (Calendar[Date])",
      "The active relationship is temporarily overridden for this measure only",
      "Without USERELATIONSHIP, SUM(Returns[RefundAmount]) would use the Sales[OrderDate] path",
    ],
    sampleModel: "Returns[ReturnDate] → Calendar[Date] (inactive). Returns[SalesID] → Sales[SalesID] → Calendar[Date] via Sales[OrderDate] (active path).",
    powerBINotes: "In Model view, inactive relationships show as dashed lines. Double-click to see which is active. You can change which is active, but USERELATIONSHIP is more flexible.",
  },
  {
    day: 9,
    tier: "foundation",
    title: "Data Categories & Formatting",
    conceptLesson: `Beyond calculations, Power BI needs metadata about your columns to work well. Data categories tell Power BI what kind of data a column contains — City, State/Province, Country, Latitude, Longitude, Web URL, or Image URL.

Setting proper data categories enables map visuals. If you set City and State data categories on your Stores table, Power BI can automatically geocode addresses and plot them on a map. Without categories, map visuals require manual configuration and may not work at all.

Display folders organize the Fields pane. Instead of a flat list of 50 measures, you can group them: "Revenue Metrics", "Customer Metrics", "Time Intelligence". This is done in the Properties pane or via Tabular Editor.

Format strings control how numbers display. The FORMAT function converts a number to a formatted string: FORMAT(1234.5, "#,0.0") returns "1,234.5". Important caveat: FORMAT() returns TEXT, not a number. This means a measure using FORMAT() cannot be used in further calculations, cannot be sorted numerically, and will sort alphabetically (so "9" comes after "10"). Only use FORMAT() when you specifically need a text result — for normal display formatting, use the Format dropdown in the Modeling tab instead.

Dynamic format strings (a newer Power BI feature) are the proper solution for conditional formatting. They let a single measure change its display format based on context while keeping the underlying value numeric. This is far superior to FORMAT() because the value remains a number — sortable, usable in calculations, and properly formatted.`,
    conceptKeyTakeaways: [
      "Data categories (City, State, Country) enable map visuals and proper geocoding",
      "Display folders organize measures in the Fields pane for better usability",
      "FORMAT() converts numbers to formatted strings — useful for conditional display",
      "Set standard formats via Modeling tab; use FORMAT() only for conditional/dynamic formatting",
    ],
    daxScenario: "The dashboard designer wants a single measure that displays sales in a compact format: values over 1M show as '1.2M', values over 1K show as '15.3K', and smaller values show as whole numbers with commas.",
    daxInstructions: `Write a measure that conditionally formats the sales value:
1. Calculate Total Sales
2. If >= 1,000,000: format as X.XM
3. If >= 1,000: format as X.XK
4. Otherwise: format as whole number with commas`,
    starterCode: `// Measure: Sales Formatted
// Conditionally format the sales amount
// >= 1M: show as "1.2M"
// >= 1K: show as "15.3K"
// else: show as "450"
Sales Formatted =
`,
    solution: `Sales Formatted =
VAR SalesAmt = SUM(Sales[TotalAmount])
RETURN
IF(
    SalesAmt >= 1000000,
    FORMAT(SalesAmt / 1000000, "#,0.0") & "M",
    IF(
        SalesAmt >= 1000,
        FORMAT(SalesAmt / 1000, "#,0.0") & "K",
        FORMAT(SalesAmt, "#,0")
    )
)`,
    validationRules: [
      { type: "contains", value: "FORMAT" },
      { type: "contains", value: "IF" },
      { type: "contains", value: "SUM" },
    ],
    expectedOutput: `Grand total: "4.3M"
Electronics category: "1.5M"
Single store: "283.3K"
Single day: "850"`,
    hints: [
      "FORMAT(number, format_string) converts a number to text",
      "Use '#,0.0' for one decimal place with comma separators",
      "Concatenate the suffix with &: FORMAT(x, '#,0.0') & 'M'",
      "WARNING: FORMAT returns TEXT — the result can't be used in calculations and will sort alphabetically, not numerically. Prefer dynamic format strings when possible.",
    ],
    sampleModel: "Sales[TotalAmount] aggregated with SUM. The formatted result is a string, not a number.",
    powerBINotes: "For most formatting, use the Format dropdown in the Modeling tab — it's cleaner than FORMAT(). Reserve FORMAT() for cases where the format must change conditionally.",
  },
  {
    day: 10,
    tier: "foundation",
    title: "Foundation Capstone",
    conceptLesson: `Before building complex DAX, audit your data model. A quick checklist: Are all relationships correct (one-to-many, single direction)? Is the date table marked? Are column names consistent (snake_case or PascalCase, but not mixed)? Are data types correct (dates as Date, not Text)?

Common model issues that cause DAX headaches: missing relationships (measures return the same value everywhere), wrong cardinality (many-to-many where it should be one-to-many), bi-directional filters causing double counting, and date columns not connected to the Calendar table.

When your model has multiple fact tables (like Sales and SalesTargets), they should connect through shared dimensions — not directly to each other. Sales connects to Stores via StoreID, and SalesTargets connects to Stores via StoreID. To compare actuals vs targets, both facts share the Stores dimension, and DAX handles the comparison.

This is the essence of a well-modeled star schema: shared dimensions act as bridges between fact tables. Your Calendar, Products, Stores, and Customers tables are the glue that connects Sales, Returns, and SalesTargets.

Today's DAX exercise combines concepts from Days 1-9 into a real-world measure: comparing actual sales against target sales, with proper use of VAR/RETURN and DIVIDE.`,
    conceptKeyTakeaways: [
      "Audit your model before writing complex DAX — bad models make DAX painful",
      "Multiple fact tables should connect through shared dimensions, not directly",
      "Check: one-to-many relationships, date table marked, consistent naming, correct data types",
      "VAR/RETURN + DIVIDE is the standard pattern for variance calculations",
    ],
    daxScenario: "The CFO wants to see how actual sales compare to targets. The Sales and SalesTargets tables both connect to the Stores dimension. Create variance measures showing the difference and the percentage.",
    daxInstructions: `Write two measures:
1. Sales vs Target Variance — actual sales minus target amount
2. Sales vs Target Variance % — the variance as a percentage of target
Both should use VAR/RETURN and DIVIDE`,
    starterCode: `// Measure 1: Sales vs Target Variance
// Actual sales minus target amount
Sales vs Target Variance =

// Measure 2: Sales vs Target Variance %
// Variance as a percentage of target
// Use DIVIDE for safe division
Sales vs Target Variance % =
`,
    solution: `Sales vs Target Variance =
VAR ActualSales = SUM(Sales[TotalAmount])
VAR TargetSales = SUM(SalesTargets[TargetAmount])
RETURN
ActualSales - TargetSales

Sales vs Target Variance % =
VAR ActualSales = SUM(Sales[TotalAmount])
VAR TargetSales = SUM(SalesTargets[TargetAmount])
RETURN
DIVIDE(ActualSales - TargetSales, TargetSales)`,
    validationRules: [
      { type: "contains", value: "SUM" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "SalesTargets" },
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
    ],
    expectedOutput: `Overall: Variance = $250,000, Variance % = 6.25%
West region: Variance = $80,000, Variance % = 8.0%
East region: Variance = -$15,000, Variance % = -1.5% (under target)`,
    hints: [
      "SUM(Sales[TotalAmount]) gives actual sales in the current filter context",
      "SUM(SalesTargets[TargetAmount]) gives the target — it also respects filter context via shared dimensions",
      "Both tables share the Stores dimension, so filtering by Region works automatically",
      "DIVIDE(variance, target) gives the percentage; returns BLANK if target is 0",
    ],
    sampleModel: "Sales[TotalAmount] and SalesTargets[TargetAmount] both filter through Stores[StoreID]. Calendar filters Sales via OrderDate. SalesTargets matches by Year+Month.",
    powerBINotes: "When actuals and targets come from different tables, they MUST share dimensions for comparison to work. If filtering by date doesn't work for targets, check that SalesTargets connects to the Calendar table.",
  },

  // ============================================================
  // BUILDER TIER — Days 11–20: Intermediate DAX & Visualization
  // ============================================================
  {
    day: 11,
    tier: "builder",
    title: "CALCULATE & Context Transition",
    conceptLesson: `CALCULATE is the single most important function in DAX. It does two things: (1) evaluates an expression in a new filter context defined by its filter arguments, and (2) performs context transition — converting any existing row context into an equivalent filter context.

When you write CALCULATE([Total Sales], Products[Category] = "Electronics"), CALCULATE creates a new filter context where Products[Category] is filtered to "Electronics". Importantly, filter arguments in CALCULATE replace any existing filter on the same column — they don't intersect with it. If the visual was already filtering Category to "Clothing", the CALCULATE filter overrides that to "Electronics".

Context transition happens whenever CALCULATE is present inside a row context. If you write SUMX(Products, CALCULATE([Total Sales])), for each product row, CALCULATE takes all columns of the current row and creates corresponding filter conditions. This is how a measure works inside an iterator. Critical insight: every measure reference contains an implicit CALCULATE — so writing SUMX(Products, [Total Sales]) also triggers context transition, because [Total Sales] internally wraps in CALCULATE.

ALL() removes all filters from a table or column. ALLEXCEPT() removes all filters EXCEPT the ones you specify. In modern DAX, REMOVEFILTERS() is the preferred function for removing filters inside CALCULATE — it's semantically clearer about intent. The difference is crucial for percentage calculations:
- % of Grand Total: DIVIDE([Total Sales], CALCULATE([Total Sales], REMOVEFILTERS(Products))) — removes ALL product filters
- % of Parent Category: DIVIDE([Total Sales], CALCULATE([Total Sales], ALLEXCEPT(Products, Products[Category]))) — removes subcategory filter but KEEPS the category filter`,
    conceptKeyTakeaways: [
      "CALCULATE evaluates an expression in a new filter context; filter arguments REPLACE existing filters on the same columns",
      "Context transition: CALCULATE (explicit or implicit in measures) converts row context → filter context",
      "REMOVEFILTERS (modern) or ALL removes filters; ALLEXCEPT removes all EXCEPT specified columns",
      "% of Total uses ALL/REMOVEFILTERS; % of Parent uses ALLEXCEPT",
    ],
    daxScenario: "The category managers want two views: each category's share of the entire company (% of Total), and each subcategory's share within its parent category (% of Parent). These require different filter manipulation.",
    daxInstructions: `Write two percentage measures:
1. % of Total Sales — each category's share of ALL sales (use ALL)
2. % of Parent Category — each subcategory's share within its parent category (use ALLEXCEPT)`,
    starterCode: `// Measure 1: % of Total Sales
// Remove ALL product filters for the denominator
% of Total Sales =

// Measure 2: % of Parent Category
// Remove subcategory filter but KEEP the category filter
% of Parent Category =
`,
    solution: `% of Total Sales =
DIVIDE(
    SUM(Sales[TotalAmount]),
    CALCULATE(
        SUM(Sales[TotalAmount]),
        ALL(Products)
    )
)

% of Parent Category =
DIVIDE(
    SUM(Sales[TotalAmount]),
    CALCULATE(
        SUM(Sales[TotalAmount]),
        ALLEXCEPT(Products, Products[Category])
    )
)`,
    validationRules: [
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "ALL" },
      { type: "contains", value: "ALLEXCEPT" },
      { type: "contains", value: "DIVIDE" },
    ],
    expectedOutput: `In a matrix with Category and Subcategory:
Electronics | Laptops: % of Total = 20%, % of Parent = 57%
Electronics | Phones: % of Total = 15%, % of Parent = 43%
Clothing | Shirts: % of Total = 12%, % of Parent = 43%`,
    hints: [
      "ALL(Products) removes ALL filters on Products — gives grand total",
      "ALLEXCEPT(Products, Products[Category]) removes all filters EXCEPT Category",
      "Both use DIVIDE([Total Sales], CALCULATE([Total Sales], filter_modifier))",
      "The numerator is just [Total Sales] — it respects the current row's filter naturally",
    ],
    sampleModel: "Products[Category] and Products[Subcategory]. Sales[ProductID] → Products[ProductID].",
    powerBINotes: "Test percentage measures in a matrix visual with Category on rows and Subcategory as a sub-level. The % of Parent should sum to 100% within each category.",
  },
  {
    day: 12,
    tier: "builder",
    title: "Time Intelligence Patterns",
    conceptLesson: `Time intelligence is one of DAX's greatest strengths. With a proper date table, you can calculate year-to-date, month-to-date, same period last year, and year-over-year growth with just a few lines.

SAMEPERIODLASTYEAR(Calendar[Date]) shifts the current date filter back by exactly one year. If the current context is March 2024, it returns March 2023 dates. Wrap it in CALCULATE to get last year's value for any measure.

TOTALYTD and TOTALMTD are convenience functions. TOTALYTD([Measure], Calendar[Date]) accumulates from January 1 through the latest date in the current filter. TOTALMTD does the same from the 1st of the current month.

The Year-over-Year Growth pattern combines these: VAR Current = [Total Sales], VAR Prior = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date])), RETURN DIVIDE(Current - Prior, Prior). This gives you the growth rate, handling the case where prior year is zero.

All time intelligence functions require: a marked date table, a contiguous date range covering all dates in your data, and the date column from the date table (not from the fact table). SAMEPERIODLASTYEAR(Sales[OrderDate]) will NOT work — you must use Calendar[Date]. This is a common source of errors: if your date table has gaps or doesn't extend far enough back, prior-year calculations will return blank.`,
    conceptKeyTakeaways: [
      "SAMEPERIODLASTYEAR shifts the date filter back one year",
      "TOTALYTD accumulates from Jan 1; TOTALMTD from the 1st of the month",
      "YoY Growth % = DIVIDE(Current - Prior, Prior) using VAR for clarity",
      "Always reference the date TABLE's date column, not the fact table's date column",
    ],
    daxScenario: "The executive team needs three time-based metrics for the monthly board report: same period last year sales, year-over-year growth percentage, and month-to-date sales.",
    daxInstructions: `Write three measures:
1. SPLY (Same Period Last Year Sales)
2. YoY Growth % (year-over-year growth as a percentage)
3. MTD Sales (month-to-date cumulative)`,
    starterCode: `// Measure 1: Same Period Last Year Sales
SPLY =

// Measure 2: YoY Growth %
// (Current - Prior) / Prior
YoY Growth % =

// Measure 3: MTD Sales
MTD Sales =
`,
    solution: `SPLY =
CALCULATE(
    SUM(Sales[TotalAmount]),
    SAMEPERIODLASTYEAR(Calendar[Date])
)

YoY Growth % =
VAR CurrentSales = SUM(Sales[TotalAmount])
VAR PriorSales =
    CALCULATE(
        SUM(Sales[TotalAmount]),
        SAMEPERIODLASTYEAR(Calendar[Date])
    )
RETURN
DIVIDE(CurrentSales - PriorSales, PriorSales)

MTD Sales =
TOTALMTD(
    SUM(Sales[TotalAmount]),
    Calendar[Date]
)`,
    validationRules: [
      { type: "contains", value: "SAMEPERIODLASTYEAR" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
      { type: "contains", value: "TOTALMTD" },
    ],
    expectedOutput: `For March 2024:
SPLY: $340,000 (March 2023 sales)
YoY Growth %: 12.5% (current March is $382,500)
MTD Sales: $382,500 (cumulative March 1-31)`,
    hints: [
      "SAMEPERIODLASTYEAR goes inside CALCULATE as a filter modifier",
      "Use Calendar[Date], not Sales[OrderDate] — time intelligence needs the date table",
      "VAR captures each value before computing the ratio",
      "TOTALMTD(expression, date_column) is the MTD convenience function",
    ],
    sampleModel: "Calendar[Date] is the marked date table. Sales[OrderDate] → Calendar[Date] (active relationship).",
    powerBINotes: "Test time intelligence in a matrix with Calendar[Year] and Calendar[MonthName] on rows. Verify SPLY shows last year's values aligned correctly.",
  },
  {
    day: 13,
    tier: "builder",
    title: "Iterator Functions",
    conceptLesson: `Standard aggregation functions like SUM and AVERAGE operate on a single column. But what if you need to calculate something per row first, THEN aggregate? That's where iterators come in.

SUMX(table, expression) iterates over each row of the table, evaluates the expression (which has row context), and sums the results. AVERAGEX does the same but averages. MAXX returns the maximum, MINX the minimum, COUNTX counts non-blank results.

A classic use case: weighted average price. You can't just AVERAGE the price — you need to weight each price by its quantity. SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]) gives the quantity-weighted total, and dividing by SUM(Sales[Quantity]) gives the weighted average.

MAXX is powerful for finding "best" records. MAXX(VALUES(Calendar[Date]), [Total Sales]) evaluates [Total Sales] for each date and returns the highest value. Since [Total Sales] is a measure, it contains an implicit CALCULATE that triggers context transition — each date's row context becomes a filter context filtering to that single date.

Iterators create row context. Inside the expression, you can access column values directly. When you reference a measure inside an iterator, the measure's implicit CALCULATE triggers context transition, converting the current row context to an equivalent filter context. This is why SUMX(Products, [Total Sales]) works — each product row becomes a filter, and [Total Sales] evaluates for that one product.`,
    conceptKeyTakeaways: [
      "Iterators (SUMX, AVERAGEX, MAXX) evaluate an expression per row, then aggregate",
      "Use iterators when you need row-level math before aggregation (e.g., weighted averages)",
      "MAXX/MINX over a table of values finds the best/worst period or entity",
      "Measures contain an implicit CALCULATE — referencing a measure inside an iterator triggers context transition",
    ],
    daxScenario: "The pricing team needs a quantity-weighted average price (not a simple average) and wants to know which single day had the highest sales volume across the entire dataset.",
    daxInstructions: `Write two measures:
1. Weighted Avg Price — quantity-weighted average unit price
2. Best Selling Day — the single date with the highest total sales amount`,
    starterCode: `// Measure 1: Weighted Avg Price
// SUMX to get quantity-weighted total, then DIVIDE by total quantity
Weighted Avg Price =

// Measure 2: Best Selling Day
// Find the date with the highest [Total Sales]
// Iterate over VALUES(Calendar[Date])
Best Selling Day =
`,
    solution: `Weighted Avg Price =
DIVIDE(
    SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]),
    SUM(Sales[Quantity])
)

Best Selling Day =
MAXX(
    VALUES(Calendar[Date]),
    SUM(Sales[TotalAmount])
)`,
    validationRules: [
      { type: "contains", value: "SUMX" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "MAXX" },
    ],
    expectedOutput: `Weighted Avg Price: $28.45 (weighted by quantity, not simple average)
Best Selling Day: $45,200 (the peak sales amount on a single day)`,
    hints: [
      "SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]) multiplies per row then sums",
      "DIVIDE(weighted_total, SUM(Sales[Quantity])) gives the weighted average",
      "MAXX(table, expression) returns the maximum value of the expression across all rows",
      "VALUES(Calendar[Date]) returns distinct dates in the current filter context",
    ],
    sampleModel: "Sales[Quantity], Sales[UnitPrice], Sales[TotalAmount]. Calendar[Date] for daily aggregation.",
    powerBINotes: "SUMX is more expensive than SUM because it iterates row by row. For simple sums, always prefer SUM. Use SUMX only when you need per-row calculations.",
  },
  {
    day: 14,
    tier: "builder",
    title: "Conditional Logic in DAX",
    conceptLesson: `DAX provides several functions for branching logic. IF(condition, true_result, false_result) is the simplest. For multiple conditions, SWITCH is cleaner than nested IFs.

SWITCH has two forms. SWITCH(expression, value1, result1, value2, result2, ..., default) matches an expression against values. SWITCH(TRUE(), condition1, result1, condition2, result2, ..., default) evaluates conditions in order and returns the first match — this is the most flexible form.

SWITCH(TRUE(), ...) replaces deeply nested IF statements. Instead of IF(x > 100, "High", IF(x > 50, "Medium", IF(x > 0, "Low", "None"))), write SWITCH(TRUE(), x > 100, "High", x > 50, "Medium", x > 0, "Low", "None"). Much more readable.

COALESCE(value1, value2, ...) returns the first non-BLANK value. Useful for fallback logic. IFERROR(expression, fallback) catches errors and returns a fallback. Use these to make your measures robust against missing data.

One important note: SWITCH evaluates conditions in order and stops at the first match. Put your most specific conditions first (x > 100 before x > 50) to avoid incorrect matches.`,
    conceptKeyTakeaways: [
      "SWITCH(TRUE(), cond1, result1, cond2, result2, default) is cleaner than nested IFs",
      "Conditions in SWITCH are evaluated top-to-bottom — put most specific first",
      "COALESCE returns the first non-BLANK value — great for fallback logic",
      "IFERROR catches division errors and other runtime issues",
    ],
    daxScenario: "Customer success wants to classify customers into tiers based on their lifetime spend. The tiers are: Platinum (>=$10K), Gold (>=$5K), Silver (>=$1K), Bronze (under $1K). This should be a measure that updates as data changes.",
    daxInstructions: `Write a measure using SWITCH(TRUE(), ...):
1. Calculate the customer's total spend with CALCULATE
2. Use SWITCH(TRUE(), ...) to classify into Platinum/Gold/Silver/Bronze
3. Order conditions from highest to lowest threshold`,
    starterCode: `// Measure: Customer Tier
// Classify based on lifetime spend:
// >= 10000: "Platinum"
// >= 5000: "Gold"
// >= 1000: "Silver"
// else: "Bronze"
Customer Tier =
`,
    solution: `Customer Tier =
VAR Spend = CALCULATE(SUM(Sales[TotalAmount]))
RETURN
SWITCH(
    TRUE(),
    Spend >= 10000, "Platinum",
    Spend >= 5000, "Gold",
    Spend >= 1000, "Silver",
    "Bronze"
)`,
    validationRules: [
      { type: "contains", value: "SWITCH" },
      { type: "contains", value: "TRUE" },
      { type: "contains", value: "CALCULATE" },
    ],
    expectedOutput: `When used in a table with customer names:
John Smith: Platinum ($12,500 spend)
Jane Doe: Gold ($7,200 spend)
Bob Wilson: Silver ($2,100 spend)
New Customer: Bronze ($150 spend)`,
    hints: [
      "SWITCH(TRUE(), condition, result, ...) evaluates conditions in order",
      "Put >= 10000 before >= 5000 — SWITCH stops at the first TRUE condition",
      "CALCULATE(SUM(Sales[TotalAmount])) triggers context transition for the current customer",
      "The last argument (no condition) is the default / else case",
    ],
    sampleModel: "Sales[TotalAmount], Sales[CustomerID] → Customers[CustomerID]. When used in a visual grouped by customer, CALCULATE triggers context transition.",
    powerBINotes: "This measure returns text, so it works well in a table or as a slicer. For calculated columns, the same logic works without CALCULATE since you already have row context.",
  },
  {
    day: 15,
    tier: "builder",
    title: "Table Functions",
    conceptLesson: `Many DAX functions return tables, not scalar values. Understanding table functions unlocks powerful filtering and analysis patterns.

FILTER(table, condition) returns a filtered copy of the table. ALL(table) returns the entire table with all filters removed. VALUES(column) returns the distinct values of a column respecting current filters. DISTINCT(column) is similar but doesn't include the blank row that VALUES might add.

TOPN(n, table, expression, [order]) returns the top N rows from a table, sorted by an expression. It's often combined with CALCULATE to filter a measure to only the top performers.

The pattern CALCULATE([Total Sales], TOPN(5, ALL(Products[ProductName]), [Total Sales])) calculates total sales but only for the top 5 products by revenue. TOPN returns a table of 5 product names, and CALCULATE uses that as a filter.

ADDCOLUMNS(table, name, expression, ...) extends a table with calculated columns — useful for building intermediate tables inside a measure. SUMMARIZE groups a table by specified columns, similar to GROUP BY in SQL. However, be cautious with SUMMARIZE: never add expression columns directly to SUMMARIZE (e.g., SUMMARIZE(Sales, Products[Category], "Total", SUM(Sales[Amount]))). Instead, wrap it with ADDCOLUMNS: ADDCOLUMNS(SUMMARIZE(Sales, Products[Category]), "Total", SUM(Sales[Amount])). Better yet, for new development use SUMMARIZECOLUMNS — it's optimized and avoids the pitfalls of SUMMARIZE.`,
    conceptKeyTakeaways: [
      "Table functions (FILTER, ALL, VALUES, TOPN) return tables that can be used as filters",
      "TOPN(n, table, expression) returns the top N rows — combine with CALCULATE for filtered measures",
      "VALUES(column) returns distinct filtered values; ALL(column) returns all values ignoring filters",
      "ADDCOLUMNS and SUMMARIZE build virtual tables for intermediate calculations",
    ],
    daxScenario: "The sales director wants a measure showing total revenue from ONLY the top 5 products by sales. This should dynamically update as filters change — the top 5 in the West region may differ from the East region.",
    daxInstructions: `Write a measure that calculates total sales for only the top 5 products:
1. Use CALCULATE to modify the filter context
2. Use TOPN to identify the top 5 products
3. Use ALL(Products[ProductName]) as the table for TOPN to ensure all products are considered`,
    starterCode: `// Measure: Top 5 Product Revenue
// Calculate total sales for only the top 5 products by revenue
// TOPN returns a table of top products, CALCULATE uses it as a filter
Top 5 Product Revenue =
`,
    solution: `Top 5 Product Revenue =
CALCULATE(
    SUM(Sales[TotalAmount]),
    TOPN(
        5,
        ALL(Products[ProductName]),
        CALCULATE(SUM(Sales[TotalAmount]))
    )
)`,
    validationRules: [
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "TOPN" },
      { type: "contains", value: "ALL" },
    ],
    expectedOutput: `Top 5 Product Revenue: $2,100,000 (sum of the 5 best-selling products)
This value changes with region/date filters — the top 5 is recalculated per context.`,
    hints: [
      "TOPN(5, table, expression) returns a table of the top 5 rows",
      "ALL(Products[ProductName]) gives all product names regardless of current filter",
      "Inside TOPN, CALCULATE(SUM(Sales[TotalAmount])) evaluates sales per product via context transition",
      "The outer CALCULATE uses the TOPN result as a filter — only those 5 products pass through",
    ],
    sampleModel: "Products[ProductName] for grouping. Sales[TotalAmount] for the sales metric. Products → Sales via ProductID.",
    powerBINotes: "TOPN can be expensive on large datasets. If the top N is always the same regardless of context, consider pre-computing it in Power Query instead.",
  },
  {
    day: 16,
    tier: "builder",
    title: "Dynamic Segmentation",
    conceptLesson: `Disconnected tables are tables with NO relationships to any other table in the model. They exist purely to drive slicer selections that your DAX measures interpret.

The most common pattern is a metric selector. Create a table with one column (e.g., MetricName) containing values like "Revenue", "Quantity", "Avg Order Value". Add it to a slicer. In your measure, use SELECTEDVALUE to read what the user picked, then SWITCH to return the appropriate calculation.

SELECTEDVALUE(column, [default]) returns the single selected value from a column. If the user selects one item, it returns that value. If multiple items are selected (or none), it returns the default. This is safer than using VALUES or FILTERS directly.

What-if parameters are another form of disconnected tables. Power BI can generate them automatically (Modeling tab → New Parameter), creating a table with GENERATESERIES and a slicer. You read the value with SELECTEDVALUE and use it in calculations like "What if prices increased by X%?"

This pattern is incredibly powerful for interactive dashboards. Instead of creating 10 separate card visuals for 10 metrics, you create one card that shows whichever metric the user selects.`,
    conceptKeyTakeaways: [
      "Disconnected tables have no relationships — they're parameter tables for slicers",
      "SELECTEDVALUE reads the user's slicer selection; returns default if nothing/multiple selected",
      "SWITCH routes the selection to the appropriate calculation",
      "What-if parameters use GENERATESERIES to create a numeric range for scenario analysis",
    ],
    daxScenario: "The dashboard team wants a single card visual that can show Revenue, Quantity, or Average Order Value based on a slicer selection. Create a metric selector pattern using a disconnected table.",
    daxInstructions: `Assume a disconnected table MetricSelector with column MetricName containing: "Revenue", "Quantity", "Avg Order Value".
Write a measure that:
1. Reads the selected metric name with SELECTEDVALUE
2. Uses SWITCH to return the matching calculation
3. Defaults to Total Sales if nothing is selected`,
    starterCode: `// Measure: Selected Metric
// Read the slicer value and return the matching calculation
// MetricSelector[MetricName] contains: "Revenue", "Quantity", "Avg Order Value"
Selected Metric =
`,
    solution: `Selected Metric =
VAR Selection =
    SELECTEDVALUE(MetricSelector[MetricName], "Revenue")
RETURN
SWITCH(
    Selection,
    "Revenue", SUM(Sales[TotalAmount]),
    "Quantity", SUM(Sales[Quantity]),
    "Avg Order Value", DIVIDE(SUM(Sales[TotalAmount]), COUNTROWS(Sales)),
    SUM(Sales[TotalAmount])
)`,
    validationRules: [
      { type: "contains", value: "SELECTEDVALUE" },
      { type: "contains", value: "SWITCH" },
    ],
    expectedOutput: `Slicer set to "Revenue": card shows $4,250,000
Slicer set to "Quantity": card shows 15,000
Slicer set to "Avg Order Value": card shows $283.33
No selection: defaults to Revenue`,
    hints: [
      "SELECTEDVALUE(column, default) returns the slicer selection or the default",
      "SWITCH(expression, value1, result1, ..., default) matches the selected value",
      "The disconnected table has no relationship — it only drives the slicer",
      "Each SWITCH branch returns a different calculation",
    ],
    sampleModel: "MetricSelector[MetricName] (disconnected). Sales[TotalAmount], Sales[Quantity] for calculations.",
    powerBINotes: "Create disconnected tables via Enter Data in the Home tab. You can also use Modeling → New Parameter for numeric what-if scenarios.",
  },
  {
    day: 17,
    tier: "builder",
    title: "Ranking & TopN Patterns",
    conceptLesson: `RANKX(table, expression, [value], [order], [ties]) ranks the current context within a table. The table defines what you're ranking over (usually ALL of a dimension), and the expression defines what you're ranking by.

RANKX(ALL(Products[ProductName]), [Total Sales]) ranks the current product against all products by total sales. The measure evaluates [Total Sales] for each product in ALL(Products[ProductName]) and assigns ranks. DESC (default) means the highest value gets rank 1.

The ties parameter controls how ties are handled: Skip (default, like 1,2,2,4) or Dense (1,2,2,3). Dense ranking is usually preferred for display.

For dynamic "Top N" patterns, combine RANKX with a slicer. Create a disconnected table with N values (5, 10, 20), read it with SELECTEDVALUE, then compare: IF([Product Sales Rank] <= N, [Total Sales], BLANK()). Products outside the top N show as blank, effectively filtering the visual.

ISINSCOPE(column) is useful with RANKX — it tells you whether a column is actively grouping the current visual. This prevents ranks from appearing on subtotal rows where they don't make sense.`,
    conceptKeyTakeaways: [
      "RANKX(ALL(dimension), expression) ranks the current row against all rows in the dimension",
      "Dense ranking (no gaps) is usually better for display: use the ties parameter",
      "Combine RANKX + SELECTEDVALUE for dynamic Top N filtering with a slicer",
      "ISINSCOPE detects whether a grouping column is active — prevents ranks on totals",
    ],
    daxScenario: "Regional managers want to see products ranked by sales, with the ability to filter to the top N products using a slicer. The rank should be dense (no gaps).",
    daxInstructions: `Write two measures:
1. Product Sales Rank — dense rank of each product by total sales
2. Is Top N — returns 1 if the product is within the top N (driven by a slicer), else 0`,
    starterCode: `// Measure 1: Product Sales Rank
// Rank products by Total Sales, dense ranking (no gaps)
Product Sales Rank =

// Measure 2: Is Top N
// Return 1 if current product's rank <= N (from a slicer)
// Assume TopNSelector[N] is a disconnected slicer table
Is Top N =
`,
    solution: `Product Sales Rank =
RANKX(
    ALL(Products[ProductName]),
    SUM(Sales[TotalAmount]),
    ,
    DESC,
    Dense
)

Is Top N =
VAR CurrentRank = [Product Sales Rank]
VAR N = SELECTEDVALUE(TopNSelector[N], 10)
RETURN
IF(CurrentRank <= N, 1, 0)`,
    validationRules: [
      { type: "contains", value: "RANKX" },
      { type: "contains", value: "ALL" },
      { type: "contains", value: "SELECTEDVALUE" },
    ],
    expectedOutput: `Product Sales Rank: Laptop Pro = 1, Tablet X = 2, ...
Is Top N (N=5): Laptop Pro = 1, Tablet X = 1, ... (top 5 show 1, rest show 0)
Use "Is Top N = 1" as a visual-level filter to show only top N products.`,
    hints: [
      "RANKX(ALL(Products[ProductName]), expression, , DESC, Dense) gives dense descending rank",
      "The fourth parameter is order (DESC/ASC), fifth is ties handling (Skip/Dense)",
      "SELECTEDVALUE(TopNSelector[N], 10) reads the slicer with default of 10",
      "Use 'Is Top N = 1' as a visual filter to dynamically show top N products",
    ],
    sampleModel: "Products[ProductName] for ranking. TopNSelector[N] disconnected table with values like 5, 10, 20.",
    powerBINotes: "Add 'Is Top N' as a visual-level filter (set to 1) rather than a page filter. This lets each visual independently show its top N.",
  },
  {
    day: 18,
    tier: "builder",
    title: "Semi-Additive Measures",
    conceptLesson: `Most business measures are additive — you can sum them across any dimension. Total Sales makes sense summed across products, regions, and time periods. But some measures are semi-additive: they can be summed across some dimensions but NOT across time.

Inventory balance is the classic example. If Store A has 100 units and Store B has 200 units, the total is 300 (additive across stores). But if January's balance is 100 and February's is 150, the total is NOT 250 — it's 150 (the latest balance). You want the last value, not the sum.

LASTDATE(Calendar[Date]) returns a single-row table containing the last date in the current filter context. CALCULATE(SUM(Inventory[StockOnHand]), LASTDATE(Calendar[Date])) filters to just that one day and returns the inventory value. Note: LASTDATE returns the last date in the Calendar table that falls within the current filter — it doesn't check whether data exists on that date.

LASTNONBLANK(Calendar[Date], expression) is an iterator that finds the last date where the expression produces a non-blank result. This is more robust for real-world data because it handles gaps (weekends, holidays, missing data). However, LASTNONBLANK is more expensive because it must evaluate the expression for each date to find the last non-blank one.

OPENINGBALANCEYEAR and CLOSINGBALANCEYEAR provide the value at the start or end of the fiscal year. These are essential for financial reporting.`,
    conceptKeyTakeaways: [
      "Semi-additive measures: additive across non-time dimensions, NOT across time",
      "Use LASTDATE for the most recent value in the time period",
      "LASTNONBLANK handles gaps by finding the last date with data",
      "OPENINGBALANCEYEAR / CLOSINGBALANCEYEAR for fiscal period start/end values",
    ],
    daxScenario: "The supply chain team tracks daily inventory snapshots. They need the ending inventory (last day of the period) and the opening balance for the fiscal year. Assume an Inventory table with Date, ProductID, and StockOnHand columns.",
    daxInstructions: `Write two measures (assume an Inventory table exists):
1. Ending Inventory — stock on hand as of the last date in the current filter
2. Opening Balance Year — stock on hand at the start of the fiscal year`,
    starterCode: `// Measure 1: Ending Inventory
// Get StockOnHand for the last date in the current filter
// Use CALCULATE + LASTDATE
Ending Inventory =

// Measure 2: Opening Balance Year
// Get StockOnHand at the start of the fiscal year
// Use OPENINGBALANCEYEAR
Opening Balance Year =
`,
    solution: `Ending Inventory =
CALCULATE(
    SUM(Inventory[StockOnHand]),
    LASTDATE(Calendar[Date])
)

Opening Balance Year =
OPENINGBALANCEYEAR(
    SUM(Inventory[StockOnHand]),
    Calendar[Date]
)`,
    validationRules: [
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "LASTDATE" },
      { type: "contains", value: "OPENINGBALANCEYEAR" },
    ],
    expectedOutput: `Viewing by Month:
March 2024 Ending Inventory: 5,200 units (value on March 31)
March 2024 Opening Balance Year: 4,800 units (value on Jan 1)
Q1 2024 Ending Inventory: 5,200 (last day of Q1 = March 31)`,
    hints: [
      "LASTDATE(Calendar[Date]) returns the single last date in the current filter",
      "CALCULATE + LASTDATE narrows to just that one day, then SUM gets the value",
      "OPENINGBALANCEYEAR(expression, dates) gets the value just before the year starts",
      "These automatically work at any time granularity — month, quarter, year",
    ],
    sampleModel: "Inventory[StockOnHand], Inventory[Date] → Calendar[Date]. Each row is a daily snapshot per product.",
    powerBINotes: "If you SUM inventory across months without LASTDATE, you'll get wildly inflated numbers. Always use semi-additive patterns for balance/snapshot data.",
  },
  {
    day: 19,
    tier: "builder",
    title: "Visualization Best Practices",
    conceptLesson: `A beautiful report that's hard to read is worse than an ugly report that communicates clearly. Visualization best practices focus on clarity, not decoration.

Chart selection matters: use bar charts for comparison, line charts for trends over time, scatter plots for correlation, and cards for KPIs. Avoid pie charts (humans are bad at comparing angles) — use a bar chart instead. Tables are appropriate when users need exact values.

The data-ink ratio principle: maximize the proportion of ink (pixels) that represents data. Remove gridlines, borders, background colors, and 3D effects unless they help comprehension. Every visual element should earn its place by conveying information.

Conditional formatting driven by DAX measures is powerful. Instead of static colors, create a measure that returns hex color codes based on KPI thresholds. Use this measure in the conditional formatting settings (Format → Color → Field value). This makes colors dynamic and consistent.

Accessibility: add alt text to every visual (for screen readers), use color-blind-safe palettes (avoid red/green only — add shapes or labels), and ensure sufficient contrast. Power BI has a built-in accessibility checker.`,
    conceptKeyTakeaways: [
      "Choose chart type based on the analytical task: comparison (bar), trend (line), KPI (card)",
      "Minimize non-data elements: remove unnecessary gridlines, borders, backgrounds",
      "Use DAX measures for conditional formatting — dynamic and consistent across visuals",
      "Prioritize accessibility: alt text, color-blind-safe palettes, sufficient contrast",
    ],
    daxScenario: "The design team wants conditional formatting on KPI cards that turns green when YoY growth exceeds 10%, yellow for 0-10% growth, and red for negative growth. Create a DAX measure that returns hex color codes.",
    daxInstructions: `Write a measure that returns a color hex code based on YoY Growth %:
1. Calculate YoY Growth % (or reference the measure from Day 12)
2. Return "#2ECC71" (green) if growth > 10%
3. Return "#F1C40F" (yellow) if growth is 0-10%
4. Return "#E74C3C" (red) if growth is negative`,
    starterCode: `// Measure: KPI Color
// Return hex color codes based on YoY Growth %
// Green (#2ECC71): growth > 10%
// Yellow (#F1C40F): growth 0% to 10%
// Red (#E74C3C): growth < 0%
KPI Color =
`,
    solution: `KPI Color =
VAR Growth =
    VAR CurrentSales = SUM(Sales[TotalAmount])
    VAR PriorSales = CALCULATE(SUM(Sales[TotalAmount]), SAMEPERIODLASTYEAR(Calendar[Date]))
    RETURN DIVIDE(CurrentSales - PriorSales, PriorSales)
RETURN
SWITCH(
    TRUE(),
    Growth > 0.1, "#2ECC71",
    Growth >= 0, "#F1C40F",
    "#E74C3C"
)`,
    validationRules: [
      { type: "contains", value: "VAR" },
      { type: "contains", value: "SWITCH" },
      { type: "contains", value: "#2ECC71" },
    ],
    expectedOutput: `This measure returns a TEXT value (hex color code).
In conditional formatting: Format → Color → Field value → select KPI Color.
Cards and tables will dynamically color based on performance.`,
    hints: [
      "Calculate the growth rate first, then branch on the result",
      "SWITCH(TRUE(), cond1, result1, cond2, result2, default) for ordered conditions",
      "Hex codes are strings: '#2ECC71' for green",
      "Apply this measure in Format → Conditional formatting → Color → Field value",
    ],
    sampleModel: "Sales[TotalAmount], Calendar[Date] for time intelligence. The measure returns a string, not a number.",
    powerBINotes: "To use this: select a visual → Format pane → Data colors → fx button → Format by: Field value → select KPI Color measure. Works on cards, tables, bar charts, and more.",
  },
  {
    day: 20,
    tier: "builder",
    title: "Builder Capstone",
    conceptLesson: `Building a dashboard is more than writing individual measures — it's designing a coherent set of metrics that tell a story. A well-designed dashboard page answers a specific business question with 4-6 visuals.

A typical sales dashboard includes: KPI cards (Total Sales, YoY Growth, Variance to Target), a trend line (monthly sales), a comparison chart (sales by region or category), and a detail table with conditional formatting. Each visual uses specific measures.

Before creating visuals, list the measures you need. For a sales dashboard: Total Sales, YoY Growth %, Sales Rank (among stores), Variance to Target, and a Conditional Color measure. Build them all first, test them in a simple table, then place them in visuals.

The metric set should be internally consistent — all measures should use the same base calculation for Total Sales, the same time intelligence patterns, and the same formatting conventions. Using VAR/RETURN and DIVIDE consistently makes the codebase maintainable.

Today you'll build a complete metric set that powers a full dashboard page. Each measure builds on concepts from Days 11-19.`,
    conceptKeyTakeaways: [
      "Design the metric set before building visuals — list all needed measures first",
      "A dashboard page should answer a specific business question with 4-6 visuals",
      "Consistency: use the same base measures, patterns (VAR/RETURN, DIVIDE), and conventions",
      "Test all measures in a simple table before placing them in formatted visuals",
    ],
    daxScenario: "Build the complete metric set for a Sales Performance dashboard. The VP needs: total sales, year-over-year growth, a rank among stores, variance to target, and a color measure for conditional formatting.",
    daxInstructions: `Write five measures that form a complete dashboard metric set:
1. Total Sales (base measure)
2. YoY Growth % (time intelligence)
3. Store Sales Rank (ranking with RANKX)
4. Variance to Target (comparing two fact tables)
5. Variance Color (conditional formatting hex codes)`,
    starterCode: `// Dashboard Metric Set

// 1. Total Sales
Total Sales =

// 2. YoY Growth %
YoY Growth % =

// 3. Store Sales Rank
Store Sales Rank =

// 4. Variance to Target
Variance to Target =

// 5. Variance Color (hex codes: green/yellow/red)
Variance Color =
`,
    solution: `Total Sales = SUM(Sales[TotalAmount])

YoY Growth % =
VAR CurrentSales = SUM(Sales[TotalAmount])
VAR PriorSales = CALCULATE(SUM(Sales[TotalAmount]), SAMEPERIODLASTYEAR(Calendar[Date]))
RETURN DIVIDE(CurrentSales - PriorSales, PriorSales)

Store Sales Rank =
RANKX(ALL(Stores[StoreName]), SUM(Sales[TotalAmount]), , DESC, Dense)

Variance to Target =
VAR Actual = SUM(Sales[TotalAmount])
VAR Target = SUM(SalesTargets[TargetAmount])
RETURN DIVIDE(Actual - Target, Target)

Variance Color =
VAR Variance = [Variance to Target]
RETURN SWITCH(TRUE(), Variance > 0.05, "#2ECC71", Variance >= 0, "#F1C40F", "#E74C3C")`,
    validationRules: [
      { type: "contains", value: "SAMEPERIODLASTYEAR" },
      { type: "contains", value: "RANKX" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
    ],
    expectedOutput: `Complete metric set for the dashboard:
Total Sales: $4,250,000
YoY Growth %: 12.5%
Store Sales Rank: varies per store (1 = best)
Variance to Target: 6.25%
Variance Color: "#2ECC71" (green, above 5% target)`,
    hints: [
      "Build each measure independently, then test together in a matrix",
      "SAMEPERIODLASTYEAR for YoY, RANKX + ALL for ranking, DIVIDE for all percentages",
      "Variance = DIVIDE(Actual - Target, Target) gives percentage variance",
      "Reference [Variance to Target] inside the color measure for consistency",
    ],
    sampleModel: "Sales[TotalAmount], SalesTargets[TargetAmount], Stores[StoreName], Calendar[Date]. All tables connected via shared dimensions.",
    powerBINotes: "Create a 'Measures' display folder to keep all dashboard measures organized. Right-click a measure → Properties → Display Folder.",
  },

  // ============================================================
  // ARCHITECT TIER — Days 21–30: Advanced DAX & Optimization
  // ============================================================
  {
    day: 21,
    tier: "architect",
    title: "Many-to-Many Relationships",
    conceptLesson: `Sometimes two dimensions have a many-to-many relationship. A customer can use multiple promotions, and a promotion can be used by multiple customers. Directly joining Customers to Promotions would create a many-to-many relationship.

The traditional solution is a bridge table (also called a junction table). CustomerPromotions has rows like (CustomerID=1, PromotionID=A), (CustomerID=1, PromotionID=B), etc. Customers → CustomerPromotions ← Promotions. Both relationships are one-to-many.

TREATAS is a DAX function that creates a virtual relationship by transferring a column's filter to another column with matching data lineage. TREATAS(table_expression, target_column) takes the values from the table expression and applies them as a filter on the target column, even without a physical relationship.

TREATAS(VALUES(Promotions[PromotionID]), CustomerPromotions[PromotionID]) takes the currently filtered promotion IDs and applies them as a filter on the CustomerPromotions table. Combined with CALCULATE, this propagates the filter through to Sales. The key advantage: TREATAS works at the column level, transferring the filter as if a relationship existed — but only for that specific measure.

When to use which: physical bridge tables with one-to-many relationships are always preferred for performance, simplicity, and because they work automatically for all measures. TREATAS is the right choice when you can't modify the model (e.g., connecting to a shared dataset), when the relationship is only needed for specific measures, or when a physical relationship would create ambiguity.`,
    conceptKeyTakeaways: [
      "Many-to-many: use a bridge/junction table with two one-to-many relationships",
      "TREATAS creates virtual relationships by applying one column's values as a filter on another",
      "Physical relationships are better for performance; TREATAS is better for flexibility",
      "TREATAS(VALUES(column), target_column) inside CALCULATE bridges the gap",
    ],
    daxScenario: "Marketing wants to see sales attributed to specific promotions. Customers can use multiple promotions, creating a many-to-many. Use TREATAS to bridge Promotions to Sales through the CustomerPromotions junction table.",
    daxInstructions: `Write a measure using TREATAS to calculate promoted sales:
1. Get the currently filtered promotion IDs from VALUES(Promotions[PromotionID])
2. Apply them as a filter on CustomerPromotions[PromotionID] via TREATAS
3. Wrap in CALCULATE with the Total Sales measure`,
    starterCode: `// Measure: Promoted Sales
// Calculate sales for customers who used the selected promotion(s)
// Use TREATAS to bridge Promotions → CustomerPromotions → Sales
Promoted Sales =
`,
    solution: `Promoted Sales =
CALCULATE(
    SUM(Sales[TotalAmount]),
    TREATAS(
        VALUES(Promotions[PromotionID]),
        CustomerPromotions[PromotionID]
    )
)`,
    validationRules: [
      { type: "contains", value: "TREATAS" },
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "VALUES" },
    ],
    expectedOutput: `When "Summer Sale" promotion is selected:
Promoted Sales: $520,000 (sales by customers who used that promotion)
When no promotion selected: shows all sales (VALUES returns all IDs)`,
    hints: [
      "TREATAS(table, target_column) applies the table values as a filter on the target column",
      "VALUES(Promotions[PromotionID]) gets the currently filtered promotion IDs",
      "The filter chain: Promotions → (TREATAS) → CustomerPromotions → Customers → Sales",
      "CALCULATE wraps everything to modify the filter context",
    ],
    sampleModel: "Promotions[PromotionID, PromotionName]. CustomerPromotions[CustomerID, PromotionID] bridge table. Sales → Customers → CustomerPromotions.",
    powerBINotes: "TREATAS is available in Power BI Desktop and is widely used for virtual relationships. It's especially useful when connecting to shared datasets where you can't add physical relationships.",
  },
  {
    day: 22,
    tier: "architect",
    title: "Calculation Groups",
    conceptLesson: `Calculation groups are one of DAX's most powerful features for reusability. Instead of creating separate YTD, PY, and YoY% versions of every measure, you create one calculation group that transforms any base measure.

A calculation group has a single column (e.g., "Time Period") with calculation items (e.g., "Current", "YTD", "PY", "YoY%"). Each item has a DAX expression that uses SELECTEDMEASURE() — a placeholder for whatever measure is in the visual.

When you put the Time Period column on a matrix column header and Total Sales as the value, the calculation items transform Total Sales into its Current, YTD, PY, and YoY% versions automatically. Change the measure to Profit and the same transformations apply. One calculation group serves all measures.

SELECTEDMEASURE() is the key function. Inside a calculation item expression, it references whatever base measure the user placed in the visual. The "YTD" item expression is TOTALYTD(SELECTEDMEASURE(), Calendar[Date]) — it applies TOTALYTD to any measure.

Calculation groups are created in Tabular Editor 3 (an external tool developed by the SQLBI team and Kasper de Jonge) or via TMDL. Power BI Desktop now also supports creating them directly in the Model view. Calculation groups are one of the most powerful features in the Tabular model — they dramatically reduce measure proliferation and ensure consistency across all time intelligence calculations.`,
    conceptKeyTakeaways: [
      "Calculation groups apply reusable transformations to ANY base measure",
      "SELECTEDMEASURE() references whatever measure the user placed in the visual",
      "One Time Intelligence calculation group replaces dozens of individual measures",
      "Created in Tabular Editor 3 or directly in Power BI Desktop's Model view",
    ],
    daxScenario: "Instead of creating separate YTD, PY, and YoY% versions of every measure, write the DAX expressions for a Time Intelligence calculation group that works with any base measure.",
    daxInstructions: `Write four calculation item expressions for a "Time Calculation" group:
1. Current — just return the measure as-is
2. YTD — apply TOTALYTD
3. PY (Prior Year) — apply SAMEPERIODLASTYEAR
4. YoY % — calculate year-over-year percentage change`,
    starterCode: `// Calculation Group: Time Calculation
// Column: Time Period

// Item: "Current"
// Just return the base measure unchanged

// Item: "YTD"
// Apply year-to-date to the base measure

// Item: "PY" (Prior Year)
// Shift to same period last year

// Item: "YoY %"
// Year-over-year percentage change
`,
    solution: `// Item: Current
SELECTEDMEASURE()

// Item: YTD
TOTALYTD(SELECTEDMEASURE(), Calendar[Date])

// Item: PY
CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR(Calendar[Date]))

// Item: YoY %
VAR Current = SELECTEDMEASURE()
VAR Prior = CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR(Calendar[Date]))
RETURN DIVIDE(Current - Prior, Prior)`,
    validationRules: [
      { type: "contains", value: "SELECTEDMEASURE" },
      { type: "contains", value: "TOTALYTD" },
      { type: "contains", value: "SAMEPERIODLASTYEAR" },
      { type: "contains", value: "DIVIDE" },
    ],
    expectedOutput: `In a matrix with Time Period on columns and Total Sales as value:
         | Current  | YTD      | PY       | YoY %
Jan 2024 | $350K    | $350K    | $310K    | 12.9%
Feb 2024 | $380K    | $730K    | $325K    | 16.9%
These same transformations apply to ANY measure placed in the visual.`,
    hints: [
      "SELECTEDMEASURE() is the placeholder for the user's chosen measure",
      "The Current item just passes through: SELECTEDMEASURE()",
      "YTD wraps it: TOTALYTD(SELECTEDMEASURE(), Calendar[Date])",
      "YoY % uses VAR to capture Current and Prior, then DIVIDE",
    ],
    sampleModel: "Calendar[Date] for time intelligence. Any measure can be the base. Created via Tabular Editor.",
    powerBINotes: "Download Tabular Editor 3 (free version available) from the External Tools tab, or create calculation groups directly in Power BI Desktop's Model view. Changes save immediately to the model.",
  },
  {
    day: 23,
    tier: "architect",
    title: "Advanced Time Intelligence",
    conceptLesson: `Standard time intelligence (YTD, PY) covers most needs, but real-world scenarios often require more: rolling 12-month averages, custom fiscal year boundaries, and parallel period comparisons.

DATESINPERIOD(date_column, start_date, intervals, interval_type) returns a contiguous set of dates. DATESINPERIOD(Calendar[Date], MAX(Calendar[Date]), -12, MONTH) gives you the 12 months ending at the latest date in context — a rolling 12-month window.

For fiscal years that don't start on January 1, TOTALYTD accepts an optional year-end date. TOTALYTD(expression, Calendar[Date], "6/30") calculates YTD based on a fiscal year ending June 30 (so the fiscal year starts July 1).

PARALLELPERIOD(date_column, intervals, interval_type) shifts the entire date filter by a number of periods. PARALLELPERIOD(Calendar[Date], -1, QUARTER) shifts back one quarter — useful for quarter-over-quarter comparisons.

DATEADD is similar but with an important difference: DATEADD(Calendar[Date], -1, MONTH) shifts the date filter back one month while preserving the exact shape of the original selection. PARALLELPERIOD always expands to complete periods. For example, if your context is January 15-20, DATEADD(-1, MONTH) returns December 15-20, while PARALLELPERIOD(-1, MONTH) returns the entire month of December. Choose based on whether you need the same date range shifted (DATEADD) or a complete prior period (PARALLELPERIOD).`,
    conceptKeyTakeaways: [
      "DATESINPERIOD creates rolling windows (e.g., trailing 12 months)",
      "TOTALYTD with year-end date parameter handles custom fiscal years",
      "PARALLELPERIOD shifts the filter to a complete prior period (quarter, year)",
      "DATEADD shifts the exact date range — more precise than PARALLELPERIOD",
    ],
    daxScenario: "Finance needs a rolling 12-month sales total (for trend analysis) and a fiscal year-to-date calculation where the fiscal year starts July 1.",
    daxInstructions: `Write two measures:
1. Rolling 12M Sales — trailing 12 months from the latest date in context
2. Fiscal YTD Sales — year-to-date based on fiscal year ending June 30`,
    starterCode: `// Measure 1: Rolling 12M Sales
// Use DATESINPERIOD to get the trailing 12 months
Rolling 12M Sales =

// Measure 2: Fiscal YTD Sales
// Use TOTALYTD with "6/30" as the fiscal year end
Fiscal YTD Sales =
`,
    solution: `Rolling 12M Sales =
CALCULATE(
    SUM(Sales[TotalAmount]),
    DATESINPERIOD(
        Calendar[Date],
        MAX(Calendar[Date]),
        -12,
        MONTH
    )
)

Fiscal YTD Sales =
TOTALYTD(
    SUM(Sales[TotalAmount]),
    Calendar[Date],
    "6/30"
)`,
    validationRules: [
      { type: "contains", value: "DATESINPERIOD" },
      { type: "contains", value: "CALCULATE" },
      { type: "contains", value: "TOTALYTD" },
    ],
    expectedOutput: `For March 2024:
Rolling 12M Sales: $4,250,000 (April 2023 through March 2024)
Fiscal YTD Sales: $2,850,000 (July 2023 through March 2024, since FY starts July 1)`,
    hints: [
      "DATESINPERIOD(Calendar[Date], MAX(Calendar[Date]), -12, MONTH) looks back 12 months",
      "MAX(Calendar[Date]) gets the latest date in the current filter as the anchor point",
      "TOTALYTD third parameter '6/30' means fiscal year ends June 30",
      "Both functions must use the date table's date column (Calendar[Date])",
    ],
    sampleModel: "Calendar[Date] marked as date table. Sales[OrderDate] → Calendar[Date]. FiscalYear and FiscalQuarter columns on the Calendar table.",
    powerBINotes: "Rolling 12-month measures are excellent for smoothing seasonality in trend charts. They show the underlying business trajectory better than monthly figures.",
  },
  {
    day: 24,
    tier: "architect",
    title: "Row-Level Security (RLS)",
    conceptLesson: `Row-Level Security restricts which data rows a user can see. A regional manager should only see their region's data. RLS enforces this at the model level — even if someone connects directly to the dataset, they only see their permitted rows.

Static RLS uses hardcoded values: create a role called "West Region" with the DAX filter [Region] = "West" on the Stores table. Simple but inflexible — you need a separate role per region.

Dynamic RLS uses USERPRINCIPALNAME() to identify the current user and look up their permissions. Create a UserSecurity table mapping email addresses to regions. The DAX filter becomes: [Region] = LOOKUPVALUE(UserSecurity[Region], UserSecurity[UserEmail], USERPRINCIPALNAME()). One role works for everyone.

RLS filters cascade through relationships. A filter on Stores[Region] = "West" automatically filters Sales (because Sales → Stores), which filters Returns (because Returns → Sales). You only need to apply the filter on the dimension table.

Testing: in Power BI Desktop, go to Modeling → View As → select a role. In the Power BI Service, test via the dataset's Security settings. Always test thoroughly before publishing.`,
    conceptKeyTakeaways: [
      "Static RLS: hardcoded filters per role — simple but doesn't scale",
      "Dynamic RLS: USERPRINCIPALNAME() + LOOKUPVALUE against a security table — one role for all",
      "RLS filters cascade through relationships — apply the filter on the dimension table",
      "Always test RLS in both Desktop (View As) and Service (Security settings)",
    ],
    daxScenario: "The security team needs dynamic RLS so each regional manager only sees their own region's data. A UserSecurity table maps email addresses to regions. Write the DAX filter expression for the Stores table.",
    daxInstructions: `Write the RLS DAX filter expression:
1. Apply to the Stores table
2. Use LOOKUPVALUE to find the current user's region from the UserSecurity table
3. Use USERPRINCIPALNAME() to get the current user's email`,
    starterCode: `// RLS Filter Expression (applied to Stores table)
// Look up the current user's region from UserSecurity
// UserSecurity columns: UserEmail, Region
// Match on email address using USERPRINCIPALNAME()

`,
    solution: `[Region] =
LOOKUPVALUE(
    UserSecurity[Region],
    UserSecurity[UserEmail],
    USERPRINCIPALNAME()
)`,
    validationRules: [
      { type: "contains", value: "LOOKUPVALUE" },
      { type: "contains", value: "USERPRINCIPALNAME" },
    ],
    expectedOutput: `When john@company.com views the report (mapped to "West" in UserSecurity):
- Only sees stores in the West region
- Sales, Returns, and Targets are automatically filtered via relationships
When jane@company.com views (mapped to "East"):
- Only sees East region data`,
    hints: [
      "LOOKUPVALUE(result_column, search_column, search_value) finds a matching value",
      "USERPRINCIPALNAME() returns the current user's email in the Power BI Service",
      "Apply this filter on the Stores table — it cascades to Sales, Returns, etc.",
      "In Desktop, USERPRINCIPALNAME() returns your local user — test with 'View As Roles'",
    ],
    sampleModel: "UserSecurity[UserEmail, Region] — a mapping table. Stores[Region] is the filtered column. Filter cascades: Stores → Sales → Returns.",
    powerBINotes: "Create RLS roles in Modeling tab → Manage Roles. Add the filter expression to the Stores table. After publishing, assign users to roles in the dataset's Security settings in the Service.",
  },
  {
    day: 25,
    tier: "architect",
    title: "Performance Optimization",
    conceptLesson: `Performance optimization starts with understanding how VertiPaq stores and queries data. VertiPaq compresses each column independently using dictionary encoding. High-cardinality columns (many unique values like GUIDs, timestamps with seconds) compress poorly and bloat the model.

DAX Studio is your essential tool. VertiPaq Analyzer shows the size of every column, table, and relationship in your model. You'll often find that one or two columns account for most of the model size. Removing or reducing their cardinality (e.g., rounding timestamps to minutes) can dramatically shrink the model.

For measure performance, the biggest wins come from: (1) using VAR to avoid repeated calculations, (2) replacing FILTER(ALL(...)) with KEEPFILTERS where appropriate, (3) avoiding nested iterators when possible, and (4) reducing the use of DISTINCTCOUNT on high-cardinality columns.

KEEPFILTERS changes how a filter argument behaves inside CALCULATE. Normally, a CALCULATE filter argument replaces any existing filter on the same column. With KEEPFILTERS, the new filter is intersected (ANDed) with the existing filter instead of replacing it. This means KEEPFILTERS only narrows the results — it never expands them beyond what the current context already shows.

The classic slow pattern: CALCULATE(SUM(...), FILTER(ALL(Sales), Sales[TotalAmount] > X)). The ALL(Sales) removes all existing filters and iterates every row. The optimized version: CALCULATE(SUM(...), KEEPFILTERS(FILTER(Sales, Sales[TotalAmount] > AvgValue))). Here, FILTER(Sales, ...) only iterates rows already in the current context, and KEEPFILTERS ensures the result intersects with (rather than replaces) existing filters.`,
    conceptKeyTakeaways: [
      "High-cardinality columns hurt VertiPaq compression — audit with DAX Studio's VertiPaq Analyzer",
      "VAR eliminates repeated calculation of the same expression",
      "KEEPFILTERS intersects (ANDs) with existing filters instead of replacing them; FILTER(ALL()) removes filters and scans everything",
      "Reduce DISTINCTCOUNT on high-cardinality columns; avoid nested iterators when possible",
    ],
    daxScenario: "A slow measure calculates 'sales above average' by scanning ALL sales rows. Rewrite it for better performance using VAR to pre-compute the average and KEEPFILTERS to limit the scan.",
    daxInstructions: `Rewrite this slow measure:
Original: CALCULATE(SUM(Sales[TotalAmount]), FILTER(ALL(Sales), Sales[TotalAmount] > AVERAGE(Sales[TotalAmount])))
1. Use VAR to capture the average outside the filter
2. Use KEEPFILTERS instead of FILTER(ALL(...))`,
    starterCode: `// SLOW VERSION (for reference):
// Sales Above Avg =
//   CALCULATE(
//     SUM(Sales[TotalAmount]),
//     FILTER(ALL(Sales), Sales[TotalAmount] > AVERAGE(Sales[TotalAmount]))
//   )

// FAST VERSION:
// Pre-compute the average, then use KEEPFILTERS
Sales Above Avg =
`,
    solution: `Sales Above Avg =
VAR AvgSales = AVERAGE(Sales[TotalAmount])
RETURN
CALCULATE(
    SUM(Sales[TotalAmount]),
    KEEPFILTERS(
        FILTER(Sales, Sales[TotalAmount] > AvgSales)
    )
)`,
    validationRules: [
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
      { type: "contains", value: "KEEPFILTERS" },
      { type: "contains", value: "CALCULATE" },
    ],
    expectedOutput: `Sales Above Avg: $2,800,000 (same result, much faster execution)
The VAR evaluates AVERAGE once; KEEPFILTERS only scans rows already in context.`,
    hints: [
      "VAR AvgSales = AVERAGE(Sales[TotalAmount]) computes the average ONCE",
      "KEEPFILTERS preserves the existing filter context (unlike ALL which removes it)",
      "FILTER(Sales, condition) inside KEEPFILTERS only scans the already-filtered rows",
      "The slow version computed AVERAGE for every row being tested — O(n^2) behavior",
    ],
    sampleModel: "Sales[TotalAmount] is the key column. The optimization avoids scanning ALL sales rows.",
    powerBINotes: "Install DAX Studio from the External Tools tab. Run VertiPaq Analyzer to find your biggest columns. Use Server Timings to measure query performance before and after optimization.",
  },
  {
    day: 26,
    tier: "architect",
    title: "Parent-Child Hierarchies",
    conceptLesson: `Some hierarchies aren't balanced — org charts, chart of accounts, and product taxonomies have varying depths. These are parent-child hierarchies where each row points to its parent via an ID.

PATH(child_id, parent_id) builds the full path from root to the current node as a pipe-delimited string. For employee 5 whose manager is 3, whose manager is 1 (the CEO): PATH returns "1|3|5".

PATHITEM(path, position, [type]) extracts an element from the path. PATHITEM("1|3|5", 1) returns "1" (the root). PATHITEM("1|3|5", 2) returns "3". The optional type parameter (INTEGER) returns the value as a number instead of text.

PATHLENGTH(path) returns the depth. "1|3|5" has length 3. This tells you the level in the hierarchy.

For rollup calculations (e.g., a manager's total includes all subordinates), you typically flatten the hierarchy into separate level columns (Level1, Level2, Level3) and build relationships or use PATHCONTAINS to check if a node is an ancestor of another.`,
    conceptKeyTakeaways: [
      "PATH() builds pipe-delimited root-to-node paths from parent-child data",
      "PATHITEM() extracts a specific level; PATHLENGTH() gives the depth",
      "Flatten to level columns for use in matrix visuals and standard hierarchies",
      "PATHCONTAINS checks ancestry — useful for rollup calculations",
    ],
    daxScenario: "HR needs to visualize the organization chart. The Employees table has EmployeeID and ManagerID (self-referencing). Build calculated columns for the hierarchy path, depth level, and top-level manager name.",
    daxInstructions: `Write three calculated columns on the Employees table:
1. Org Path — the full hierarchy path using PATH
2. Org Level — the depth using PATHLENGTH
3. Level 1 Manager — the top-level manager's name using PATHITEM + LOOKUPVALUE`,
    starterCode: `// Calculated Column 1: Org Path
// Full hierarchy path from root to current employee
Org Path =

// Calculated Column 2: Org Level
// Depth in the hierarchy
Org Level =

// Calculated Column 3: Level 1 Manager
// Name of the top-level manager (root of the path)
// Use PATHITEM to get ID, then LOOKUPVALUE to get the name
Level 1 Manager =
`,
    solution: `Org Path =
PATH(Employees[EmployeeID], Employees[ManagerID])

Org Level =
PATHLENGTH([Org Path])

Level 1 Manager =
LOOKUPVALUE(
    Employees[EmployeeName],
    Employees[EmployeeID],
    PATHITEM([Org Path], 1, INTEGER)
)`,
    validationRules: [
      { type: "contains", value: "PATH" },
      { type: "contains", value: "PATHLENGTH" },
      { type: "contains", value: "PATHITEM" },
      { type: "contains", value: "LOOKUPVALUE" },
    ],
    expectedOutput: `Employee "Alice" (ID 5, reports to Bob ID 3, who reports to CEO ID 1):
Org Path: "1|3|5"
Org Level: 3
Level 1 Manager: "CEO Name" (looked up from ID 1)`,
    hints: [
      "PATH(child_column, parent_column) builds the pipe-delimited path",
      "PATHLENGTH returns the number of levels (count of elements in the path)",
      "PATHITEM(path, 1, INTEGER) gets the first element (root) as an integer",
      "LOOKUPVALUE converts the ID back to a name",
    ],
    sampleModel: "Employees[EmployeeID, EmployeeName, ManagerID]. ManagerID references EmployeeID (self-referencing). CEO has BLANK ManagerID.",
    powerBINotes: "After creating level columns, build a standard hierarchy in the Fields pane: right-click → Create hierarchy → add Level1, Level2, Level3. This enables drill-down in matrix visuals.",
  },
  {
    day: 27,
    tier: "architect",
    title: "Advanced Filtering Patterns",
    conceptLesson: `Beyond ALL and ALLEXCEPT, DAX has several powerful filter modifiers that control exactly which filters are active during a calculation.

REMOVEFILTERS is the recommended replacement for ALL when used as a CALCULATE modifier. REMOVEFILTERS(Products[Subcategory]) is clearer than ALL(Products[Subcategory]) because it explicitly communicates the intent: you're removing a filter, not returning a table. ALL has dual semantics — as a table function it returns all rows, as a CALCULATE modifier it removes filters. This ambiguity can confuse readers. REMOVEFILTERS eliminates that confusion. Always use REMOVEFILTERS for new measures when the goal is to remove filters.

ALLSELECTED preserves the "outer" filter context — typically the slicer selections — while removing only the visual-level grouping filters. In a visual showing categories, CALCULATE([Total Sales], ALLSELECTED(Products[Category])) gives the total across all visible categories (respecting slicers) while ignoring the per-row category filter. This is perfect for "% of visible total" calculations.

KEEPFILTERS intersects the new filter with the existing context instead of replacing it. Normal CALCULATE filters REPLACE existing filters. With KEEPFILTERS, the new filter is ANDed with whatever was already there. This prevents unexpected expansion of results.

When to use which: REMOVEFILTERS to explicitly clear specific filters, ALLSELECTED for "% of what the user can see", KEEPFILTERS when adding conditions that should respect existing filters.`,
    conceptKeyTakeaways: [
      "REMOVEFILTERS: modern, clear replacement for ALL as a CALCULATE modifier",
      "ALLSELECTED: preserves slicer/page filters, removes only visual grouping — perfect for '% of visible'",
      "KEEPFILTERS: intersects (ANDs) with existing filters instead of replacing them",
      "Choose based on intent: clear (REMOVEFILTERS), visible total (ALLSELECTED), additive (KEEPFILTERS)",
    ],
    daxScenario: "The dashboard needs two measures: one showing each category's percentage of the visible (slicer-filtered) total, and another showing category-level totals even when subcategory is in the visual.",
    daxInstructions: `Write two measures:
1. % of Visible Total — each row's share of the total visible in the visual (use ALLSELECTED)
2. Category Total — show the category total regardless of subcategory grouping (use REMOVEFILTERS)`,
    starterCode: `// Measure 1: % of Visible Total
// Each row's share of the total respecting slicers but ignoring row grouping
% of Visible Total =

// Measure 2: Category Total
// Category-level total even when subcategory is in the visual
// Remove the subcategory filter only
Category Total =
`,
    solution: `% of Visible Total =
DIVIDE(
    SUM(Sales[TotalAmount]),
    CALCULATE(
        SUM(Sales[TotalAmount]),
        ALLSELECTED(Products[Category])
    )
)

Category Total =
CALCULATE(
    SUM(Sales[TotalAmount]),
    REMOVEFILTERS(Products[Subcategory])
)`,
    validationRules: [
      { type: "contains", value: "ALLSELECTED" },
      { type: "contains", value: "REMOVEFILTERS" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "CALCULATE" },
    ],
    expectedOutput: `With slicer filtering to Electronics and Clothing only:
Electronics: % of Visible Total = 56%, Category Total = $1,487,500
  Laptops: % of Visible Total = 32%
  Phones: % of Visible Total = 24%
Clothing: % of Visible Total = 44%, Category Total = $1,190,000`,
    hints: [
      "ALLSELECTED(column) keeps slicer filters but removes the visual's row grouping filter",
      "This means '% of Visible Total' sums to 100% for whatever the slicers show",
      "REMOVEFILTERS(Products[Subcategory]) clears only the subcategory filter",
      "Category Total shows the same value for all subcategories within a category",
    ],
    sampleModel: "Products[Category], Products[Subcategory]. Sales[TotalAmount]. Slicers may filter regions, dates, etc.",
    powerBINotes: "ALLSELECTED is essential for conditional formatting that compares against the visual total, not the grand total. It respects what the user has filtered to.",
  },
  {
    day: 28,
    tier: "architect",
    title: "Power BI Service & Deployment",
    conceptLesson: `Power BI Desktop is for development; the Power BI Service is for sharing and collaboration. Understanding the deployment workflow is essential for production solutions.

Workspaces are containers for reports, datasets, and dataflows. Best practice: create separate workspaces for Development, Test, and Production. Deployment pipelines automate the promotion from Dev → Test → Prod, changing data source connections at each stage.

Scheduled refresh keeps imported data current. Configure refresh schedules in the dataset settings — up to 8 times per day (48 with Premium). For real-time needs, use DirectQuery or streaming datasets.

Dataflows provide shared ETL. Instead of every report doing its own Power Query transforms, a dataflow centralizes the logic. Multiple reports can connect to the same dataflow output, ensuring consistency.

Git integration (preview/GA) enables version control for Power BI content. Connect a workspace to an Azure DevOps or GitHub repo, and changes are tracked with full history. This enables code review, branching, and rollback for Power BI reports.

What-if parameters let report consumers explore scenarios. GENERATESERIES creates a numeric range, and SELECTEDVALUE reads the user's choice. This is a powerful pattern for financial modeling and planning.`,
    conceptKeyTakeaways: [
      "Use deployment pipelines (Dev → Test → Prod) for controlled releases",
      "Scheduled refresh for import models; DirectQuery for real-time needs",
      "Dataflows centralize ETL for consistency across multiple reports",
      "Git integration enables version control, code review, and rollback",
    ],
    daxScenario: "The finance team wants a what-if analysis: 'What if we increased prices by X%?' Create a parameter table and a measure that applies the user-selected price increase to total revenue.",
    daxInstructions: `Write two measures:
1. Price Increase Value — read the selected percentage from a what-if parameter slicer
2. Adjusted Revenue — apply the price increase to total sales`,
    starterCode: `// Assume a what-if parameter table created with:
// Price Increase % = GENERATESERIES(0, 0.50, 0.05)
// (0% to 50% in 5% increments)

// Measure 1: Price Increase Value
// Read the selected percentage (default to 0)
Price Increase Value =

// Measure 2: Adjusted Revenue
// Total Sales * (1 + selected increase %)
Adjusted Revenue =
`,
    solution: `Price Increase Value =
SELECTEDVALUE('Price Increase %'[Price Increase %], 0)

Adjusted Revenue =
VAR Increase = [Price Increase Value]
RETURN
SUM(Sales[TotalAmount]) * (1 + Increase)`,
    validationRules: [
      { type: "contains", value: "SELECTEDVALUE" },
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
      { type: "contains", value: "Sales[TotalAmount]" },
    ],
    expectedOutput: `With Price Increase % set to 10% (0.10):
Price Increase Value: 0.10
Adjusted Revenue: $4,675,000 ($4,250,000 * 1.10)
With 25%: Adjusted Revenue: $5,312,500`,
    hints: [
      "SELECTEDVALUE reads the slicer selection; the default (0) means no increase",
      "GENERATESERIES(0, 0.50, 0.05) creates values: 0, 0.05, 0.10, ..., 0.50",
      "Multiply total sales by (1 + increase) to get the adjusted amount",
      "VAR captures the increase, then the RETURN does the math",
    ],
    sampleModel: "'Price Increase %' disconnected table with one column. Sales[TotalAmount] for base revenue.",
    powerBINotes: "Create what-if parameters via Modeling → New Parameter. Power BI auto-generates the table, measure, and slicer. You can customize the DAX afterward.",
  },
  {
    day: 29,
    tier: "architect",
    title: "Composite Models & DirectQuery",
    conceptLesson: `Power BI offers three storage modes: Import (data is loaded into memory — fast queries, limited by refresh), DirectQuery (queries go to the source in real-time — no data loaded, but slower), and Dual (both — used by the engine for optimization).

Composite models combine Import and DirectQuery in one model. Large fact tables can stay in DirectQuery (real-time, no import needed), while small dimension tables are imported (for fast filtering and VertiPaq compression). The engine optimizes queries across both modes.

User-defined aggregation tables pre-compute common aggregates. If your detail fact table has 1 billion rows in DirectQuery, create a smaller imported aggregation table with pre-summed values by Category and Month. Power BI automatically uses the aggregation table when possible (faster) and falls back to the detail table when needed (drill-through).

ISFILTERED(column) detects whether a specific column is in the current filter context. ISCROSSFILTERED(column) detects if the column is filtered directly OR indirectly through a relationship. These functions are useful for building smart measures that choose between aggregated and detail data based on the query granularity.`,
    conceptKeyTakeaways: [
      "Import: fast queries, data loaded into memory; DirectQuery: real-time, queries hit the source",
      "Composite models mix both — large facts in DirectQuery, small dimensions imported",
      "Aggregation tables pre-compute for common queries; Power BI auto-selects the right table",
      "ISFILTERED/ISCROSSFILTERED detect query granularity for smart fallback logic",
    ],
    daxScenario: "You have a large DirectQuery fact table and a small imported aggregation table. Write a measure that uses the aggregated data when at category level, but falls back to the detail table when the user drills to product level.",
    daxInstructions: `Write a smart aggregation measure:
1. Use ISFILTERED to check if ProductName is in the filter context
2. If ProductName IS filtered (user drilled to product detail), query the Sales table
3. If ProductName is NOT filtered (category level), use the SalesAgg pre-aggregated table`,
    starterCode: `// Measure: Smart Aggregation
// Use SalesAgg (pre-aggregated, imported) when at category level
// Fall back to Sales (detail, DirectQuery) when at product level
// Check if Products[ProductName] is in the filter context
Smart Aggregation =
`,
    solution: `Smart Aggregation =
IF(
    ISFILTERED(Products[ProductName]),
    CALCULATE(SUM(Sales[TotalAmount])),
    CALCULATE(SUM(SalesAgg[TotalAmount]))
)`,
    validationRules: [
      { type: "contains", value: "ISFILTERED" },
      { type: "contains", value: "IF" },
      { type: "contains", value: "CALCULATE" },
    ],
    expectedOutput: `At Category level: uses SalesAgg (fast, imported) — $4,250,000
At Product level: uses Sales (detail, DirectQuery) — Laptop Pro: $850,000
The switch is transparent to the user.`,
    hints: [
      "ISFILTERED(column) returns TRUE if that column has an active filter",
      "When ProductName is not filtered, we're at a higher grain — use the agg table",
      "When ProductName IS filtered, we need detail — use the full Sales table",
      "In production, Power BI handles this automatically with aggregation tables — this DAX is for custom logic",
    ],
    sampleModel: "Sales (detail fact, DirectQuery). SalesAgg (pre-aggregated, Import). Products[ProductName] for granularity detection.",
    powerBINotes: "Set up aggregation tables in Model view: select the agg table → Manage aggregations. Power BI auto-routes queries. Use this DAX only when you need custom fallback logic beyond what auto-aggregation provides.",
  },
  {
    day: 30,
    tier: "architect",
    title: "Architect Capstone",
    conceptLesson: `This is the culmination of 30 days. A production-ready Power BI solution combines: a clean star schema, proper date table, optimized DAX measures using VAR/RETURN and DIVIDE, time intelligence, row-level security, and deployment-ready configuration.

An Executive KPI Card Set is the standard deliverable for senior stakeholders. It includes: a primary metric (Total Revenue), its time intelligence variants (YTD, vs Last Year), comparative metrics (Rank, Variance to Target), and visual indicators (Trend Arrow, Status Color).

Each measure should follow best practices: VAR/RETURN for clarity and performance, DIVIDE for all divisions, SWITCH(TRUE()) for conditional logic, and consistent naming conventions. The measures should reference each other where possible (e.g., Variance Color references Variance to Target) for maintainability.

The trend arrow pattern uses UNICHAR to display up/down/flat arrows as text characters. UNICHAR(9650) is an up triangle, UNICHAR(9660) is a down triangle, UNICHAR(9644) is a horizontal bar. These render directly in card and table visuals without needing images.

Review your complete set: are all measures consistent? Do they handle edge cases (division by zero, missing prior year data)? Would a new team member understand the DAX? If yes — you've built a production-ready Power BI solution.`,
    conceptKeyTakeaways: [
      "A complete KPI set: primary metric, time intelligence, rank, variance, visual indicators",
      "Use VAR/RETURN, DIVIDE, and SWITCH(TRUE()) consistently across all measures",
      "UNICHAR for trend arrows: 9650 (up), 9660 (down), 9644 (flat)",
      "Production DAX: consistent naming, measures reference each other, handles edge cases",
    ],
    daxScenario: "Build the complete Executive KPI Card Set for the CEO dashboard. This is your final deliverable — a cohesive set of measures that power KPI cards, trend indicators, and conditional formatting.",
    daxInstructions: `Write seven measures that form the complete executive KPI set:
1. Total Revenue — base measure
2. Revenue YTD — year-to-date
3. Revenue vs LY — year-over-year percentage
4. Revenue Rank — rank among stores
5. Trend Arrow — up/down/flat based on month-over-month
6. KPI Status Color — hex color based on YoY performance
Use VAR/RETURN and DIVIDE throughout.`,
    starterCode: `// Executive KPI Card Set

// 1. Total Revenue
Total Revenue =

// 2. Revenue YTD
Revenue YTD =

// 3. Revenue vs LY (year-over-year %)
Revenue vs LY =

// 4. Revenue Rank (among stores, dense)
Revenue Rank =

// 5. Trend Arrow (month-over-month comparison)
// Up: UNICHAR(9650), Down: UNICHAR(9660), Flat: UNICHAR(9644)
Trend Arrow =

// 6. KPI Status Color
// Green: > 10% YoY, Yellow: 0-10%, Red: negative
KPI Status Color =
`,
    solution: `Total Revenue = SUM(Sales[TotalAmount])

Revenue YTD =
TOTALYTD(SUM(Sales[TotalAmount]), Calendar[Date])

Revenue vs LY =
VAR CurrentRev = SUM(Sales[TotalAmount])
VAR PriorRev = CALCULATE(SUM(Sales[TotalAmount]), SAMEPERIODLASTYEAR(Calendar[Date]))
RETURN DIVIDE(CurrentRev - PriorRev, PriorRev)

Revenue Rank =
RANKX(ALL(Stores[StoreName]), SUM(Sales[TotalAmount]), , DESC, Dense)

Trend Arrow =
VAR CurrentMonth = SUM(Sales[TotalAmount])
VAR PriorMonth = CALCULATE(SUM(Sales[TotalAmount]), DATEADD(Calendar[Date], -1, MONTH))
RETURN
SWITCH(
    TRUE(),
    CurrentMonth > PriorMonth, UNICHAR(9650),
    CurrentMonth < PriorMonth, UNICHAR(9660),
    UNICHAR(9644)
)

KPI Status Color =
VAR YoY = [Revenue vs LY]
RETURN
SWITCH(TRUE(), YoY > 0.1, "#2ECC71", YoY >= 0, "#F1C40F", "#E74C3C")`,
    validationRules: [
      { type: "contains", value: "TOTALYTD" },
      { type: "contains", value: "SAMEPERIODLASTYEAR" },
      { type: "contains", value: "RANKX" },
      { type: "contains", value: "DIVIDE" },
      { type: "contains", value: "VAR" },
      { type: "contains", value: "RETURN" },
      { type: "contains", value: "SWITCH" },
    ],
    expectedOutput: `Executive KPI Card Set:
Total Revenue: $4,250,000
Revenue YTD: $1,125,000 (for Q1)
Revenue vs LY: 12.5%
Revenue Rank: #3 (among all stores)
Trend Arrow: up-arrow (month-over-month increase)
KPI Status Color: "#2ECC71" (green — above 10% growth)`,
    hints: [
      "Build each measure to reference others where possible (KPI Status Color uses [Revenue vs LY])",
      "UNICHAR(9650) = up triangle, UNICHAR(9660) = down triangle, UNICHAR(9644) = flat bar",
      "DATEADD(Calendar[Date], -1, MONTH) shifts to the prior month for trend comparison",
      "Test all measures together in a table visual before placing in cards",
    ],
    sampleModel: "Full model: Sales, Products, Customers, Stores, Calendar, SalesTargets, Returns. All relationships active.",
    powerBINotes: "Congratulations! This KPI set is the foundation of executive dashboards. Place Total Revenue and Trend Arrow in a card, Revenue vs LY with KPI Status Color in a conditional-formatted card, and Revenue Rank in a matrix.",
  },
];

export function getChallenge(day: number): Challenge | undefined {
  return challenges.find((c) => c.day === day);
}
