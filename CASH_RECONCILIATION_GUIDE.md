# Daily Cash Reconciliation - User Guide

## Overview
The Daily Cash Reconciliation feature allows administrators to review and manage all dispatches organized by date, with the ability to delete incorrect or fraudulent dispatch records.

## Accessing Cash Reconciliation

### Step 1: Log in as Administrator
- Go to the login page
- Enter your admin email and password
- Click "Log In"

### Step 2: Navigate to Admin Dashboard
- After login, you'll be redirected to the Admin Dashboard
- You should see four tabs at the top:
  1. **Inventory** - Manage products and stock
  2. **Users** - Create and manage system users
  3. **Dispatched Equipment** - View all dispatches
  4. **Cash Reconciliation** - NEW TAB! ← Click here

### Step 3: View Cash Reconciliation
- Click the "💰 Cash Reconciliation" tab
- You'll see the reconciliation dashboard

## Dashboard Overview

### Top Statistics Section
Shows three key metrics:
- **Total Days**: How many different days have dispatch activity
- **Total Revenue**: Sum of all dispatch costs across all time
- **Total Dispatches**: Total number of dispatch records

### Date Sections
- Each date appears as a collapsible section (most recent dates first)
- Shows a quick summary:
  - Number of dispatches that day
  - Total units dispatched
  - Total revenue for that day

## Viewing Dispatch Details

### Expand a Date Section
1. Click anywhere on a date row
2. The section will expand to show a detailed table
3. Click again to collapse

### Reading the Dispatch Table
Each dispatch shows:
- **Dispatch ID**: Unique transaction ID (starts with DESP-)
- **Product**: Name of the product dispatched
- **Quantity**: Number of units
- **Recipient**: Name of company or person receiving
- **Cost**: Amount charged (price per unit × quantity)
- **User**: Name of the dispatcher
- **Time**: Exact time the dispatch was recorded
- **Action**: Delete button (trash icon)

## Deleting a Dispatch

### When to Delete
Delete a dispatch when:
- The dispatch was recorded by mistake
- The dispatch is fraudulent
- The dispatch was entered twice
- The dispatch needs to be reversed

### How to Delete

#### Step 1: Find the dispatch
- Navigate to the correct date section
- Expand the date by clicking on it
- Find the dispatch in the table

#### Step 2: Click Delete
- Click the trash icon (🗑️) in the "Action" column
- A confirmation dialog will appear

#### Step 3: Confirm
- Read the warning message carefully
- Click "OK" to confirm deletion
- Click "Cancel" if you changed your mind

#### Step 4: Verify
- You'll see a green success message: "✅ Dispatch deleted successfully"
- The dispatch disappears from the table
- The daily totals automatically recalculate

### What Happens When You Delete

When you delete a dispatch:
1. ✅ Dispatch is removed from the database
2. ✅ Product quantity is restored to inventory
3. ✅ "Dispatched" counter is decreased
4. ✅ Dispatch user's record is updated (they'll see it removed)
5. ✅ All calculations update automatically

**Example:**
- If a user dispatched 50 units of Product A for $100
- You delete that dispatch as admin
- Product A quantity increases by 50 units
- The $100 is removed from total revenue
- That user's dispatch history no longer shows this record

## Best Practices

### Daily Reconciliation Process
1. **End of Day**: Review all dispatches from the current date
2. **Verify**: Check against receipts or shipping documents
3. **Balance**: Ensure numbers match your physical inventory
4. **Delete**: Remove any discrepancies or errors
5. **Save**: Print or export report for records

### Error Prevention
- Double-check before deleting (use confirmation dialog)
- Compare dispatch records with physical shipments
- Look for duplicate dispatch IDs
- Verify recipient names and quantities
- Check that costs are reasonable

### Record Keeping
- Review reconciliation regularly
- Keep audit trail of deletions
- Note reasons for major discrepancies
- Share reports with management
- Archive monthly reconciliation reports

## Troubleshooting

### Dispatch Not Found
- Check if the dispatch is from a different date
- Scroll through all date sections
- Use browser search (Ctrl+F) for dispatch ID

### Can't Delete (Button Disabled)
- Ensure you're logged in as admin
- Only administrators can delete dispatches
- Check user permissions

### Deleted Wrong Dispatch
- Unfortunately, deletions are permanent
- You'll need to have the user re-enter the dispatch
- Or create a new dispatch record with correct information

### Numbers Don't Match
- Expand all dates and manually verify total
- Check if you're missing some dates
- Verify products aren't deleted from inventory

## FAQ

**Q: Can dispatch users delete their own dispatches?**
A: No, only administrators can delete dispatches. This ensures data integrity and audit trail.

**Q: What if I delete a dispatch by mistake?**
A: Deletions are permanent. You would need to:
1. Contact the dispatch user to re-enter the information
2. Or manually create a new dispatch record

**Q: Do deleted dispatches show in reports?**
A: No, deleted dispatches are completely removed from the system. They won't appear in any reports.

**Q: Can I undo a deletion?**
A: Currently, no. Plan carefully before deleting and use the confirmation dialog.

**Q: How often should I reconcile?**
A: At minimum daily (end of shift), but can do multiple times per day depending on volume.

**Q: What if the cost is wrong on a dispatch?**
A: Currently you must delete and have the user re-enter. A future update may allow editing.

## Support

For issues or questions:
- Contact your system administrator
- Check that you have admin privileges
- Verify all data before making changes
- Review the audit trail of deletions

---

**Version**: 1.0  
**Last Updated**: October 16, 2024
