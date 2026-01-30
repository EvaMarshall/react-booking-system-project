/**
Normalises dates to 'YYYY-MM-DD' format for consistency across DB writes, logging, and validation.
 
  Why it might be needed:
  - Prevents timezone issues when comparing or storing dates (especially in MySQL).
  - Ensures clean, readable logs for audits and debugging.
  - Simplifies user input validation by aligning formats before comparisons.
 
Current usage might be minimal, but centralising formatting here future-proofs logic
for expansion (e.g., multi-locale support, frontend-backend alignment, or date parsing from strings).
 
Steps for this if time allows -

 Step 1: Create the Utility Function
  [...]
  return `${year}-${month}-${day}`;


 Step 2: Where to Use It
  Service Layer — When Writing to DB
  Validation Layer — During Comparisons

  Handle invalid inputs gracefully

  Extend with time formatting if needed (e.g. YYYY-MM-DD HH:mm:ss)
 */