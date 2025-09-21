import { StateInput, StateSelect, StateDatePicker } from "../FormFields";
import { HStack, Text, Button } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

function FilterControls({ filters, setFilters, customers = [], onExport, onClear }) {
    return (
        <HStack wrap="wrap" spacing={3}>
            <StateSelect
                value={filters.customer || ""}
                onChange={(e) => setFilters(f => ({ ...f, customer: e.target.value }))}
                placeholder="Filter by customer"
                options={customers}
                maxW="250px"
            />
            <HStack>
                <Text>From</Text>
                <StateDatePicker
                    value={filters.dateFrom || ""}
                    onChange={(value) => setFilters(f => ({ ...f, dateFrom: value }))}
                    placeholder="From date"
                    showTimeSelect={true}
                />
            </HStack>
            <HStack>
                <Text>To</Text>
                <StateDatePicker
                    value={filters.dateTo || ""}
                    onChange={(value) => setFilters(f => ({ ...f, dateTo: value }))}
                    placeholder="To date"
                    showTimeSelect={true}
                />
            </HStack>
            <Button variant="outline" onClick={onClear}>
                Clear
            </Button>
            <Button leftIcon={<DownloadIcon />} onClick={onExport}>
                Export Excel
            </Button>
        </HStack>
    );
}

export default FilterControls;