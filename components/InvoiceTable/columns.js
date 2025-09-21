import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/utils/format";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, HStack, Badge } from "@chakra-ui/react";
import { getCellValue, getCurrencyCell, getDateCell } from "@/utils/column-helpers";

const columnHelper = createColumnHelper();

// Status badge component
const StatusBadge = ({ status }) => {
    const colorScheme = {
        draft: "gray",
        sent: "blue",
        paid: "green",
        overdue: "red"
    }[status] || "gray";

    return <Badge colorScheme={colorScheme}>{status}</Badge>;
};

// Action buttons component
const ActionButtons = ({ row, onEdit, onDelete }) => (
    <HStack spacing={2}>
        <IconButton
            aria-label="Edit"
            icon={<EditIcon />}
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                onEdit?.(row.original);
            }}
        />
        <IconButton
            aria-label="Delete"
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row.original);
            }}
        />
    </HStack>
);

export const invoiceTableColumns = ({ onEdit, onDelete }) => {
    const columnDef = [
        columnHelper.accessor("number", {
            header: "Number",
            cell: (info) => getCellValue(info),
            className: "number-column"
        }),
        columnHelper.accessor("customerName", {
            header: "Customer",
            cell: (info) => getCellValue(info),
            className: "customer-column"
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => getCellValue(info, (status) => <StatusBadge status={status} />, <StatusBadge status="draft" />),
            className: "status-column"
        }),
        columnHelper.accessor("createdAt", {
            header: "Created",
            cell: (info) => getDateCell(info),
            className: "created-column"
        }),
        columnHelper.accessor("dueDate", {
            header: "Due Date",
            cell: (info) => getDateCell(info, "MMM D, YYYY"),
            className: "due-date-column"
        }),
        columnHelper.accessor("total", {
            header: "Total",
            cell: (info) => getCurrencyCell(info),
            className: "total-column"
        })
    ];

    // Add actions column if onEdit or onDelete is provided
    if (onEdit || onDelete) {
        columnDef.push(
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: (info) => (<ActionButtons row={info.row} onEdit={onEdit} onDelete={onDelete} />),
                className: "actions-column"
            })
        );
    }

    return columnDef;
};
