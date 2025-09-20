"use client";
import React from "react";
import { Button, Grid, GridItem, HStack, VStack, IconButton, useDisclosure, useToast, Text, Box, Divider, Input, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { useFormik } from "formik";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import useCustomers from "@/hooks/useCustomers";
import { calcTotals, calcItemAmount } from "@/utils/calc";
import { formatCurrency } from "@/utils/format";
import ModalWrapper from "@/components/ModalWrapper";
import CustomerForm from "@/components/CustomerForm";
import { InputField, SelectField, TextareaField, NumberInputFieldComponent, DatePickerField } from "@/components/FormFields";
import { invoiceSchema } from "validations/invoice-validation";
import { invoiceInitialValues } from "@/constants/initialvalues";
import { INVOICE_STATUS, INVOICE_STATUS_LABELS } from "@/constants/invoices";

export default function InvoiceForm({ initialValues, onSubmit, submitLabel = "Save Invoice" }) {
  const { customers, add: addCustomer } = useCustomers();
  const custModal = useDisclosure();
  const toast = useToast();

  const formik = useFormik({
    initialValues: { ...invoiceInitialValues, ...(initialValues || {}) },
    validationSchema: invoiceSchema,
    onSubmit: (values, actions) => {
      const totals = calcTotals(values.items, values.taxRate);
      const payload = { ...values, ...totals };
      actions.setSubmitting(true);
      Promise.resolve(onSubmit(payload))
        .finally(() => actions.setSubmitting(false));
    }
  });

  const { values, errors, touched, setFieldValue, isSubmitting, handleSubmit, handleChange, handleBlur } = formik;
  const totals = calcTotals(values.items, values.taxRate);

  // Handler for customer selection change
  const handleCustomerSelect = (e) => {
    const id = e.target.value;
    setFieldValue("customerId", id);
    if (!id) return;
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setFieldValue("customerName", customer.name || "");
      setFieldValue("customerEmail", customer.email || "");
    }
  };

  // Handler for new customer creation
  const handleCustomerSubmit = async (customerData) => {
    try {
      const id = await addCustomer(customerData);
      setFieldValue("customerId", id);
      setFieldValue("customerName", customerData.name || "");
      setFieldValue("customerEmail", customerData.email || "");
      custModal.onClose();
      toast({ status: "success", title: "Customer created" });
    } catch (e) {
      // Error is handled in CustomerForm toast
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" spacing={6}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <InputField
              field={{ name: "number", value: values.number, onChange: handleChange, onBlur: handleBlur }}
              form={{ errors, touched }}
              label="Invoice Number"
              placeholder="INV-0001"
            />
          </GridItem>
          <GridItem>
            <SelectField
              field={{ name: "status", value: values.status, onChange: handleChange, onBlur: handleBlur }}
              form={{ errors, touched }}
              label="Status"
            >
              {Object.entries(INVOICE_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {INVOICE_STATUS_LABELS[value]}
                </option>
              ))}
            </SelectField>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Customer</FormLabel>
              <HStack>
                <Select
                  placeholder="Select existing customer"
                  value={values.customerId || ""}
                  onChange={handleCustomerSelect}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
                <Button onClick={custModal.onOpen} variant="outline">New</Button>
              </HStack>
              <Text fontSize="xs" color="gray.500">Or enter details manually below.</Text>
            </FormControl>
          </GridItem>
          <GridItem>
            <InputField
              field={{ name: "customerEmail", value: values.customerEmail, onChange: handleChange, onBlur: handleBlur }}
              form={{ errors, touched }}
              label="Customer Email"
              type="email"
              placeholder="customer@example.com"
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <InputField
              field={{ name: "customerName", value: values.customerName, onChange: handleChange, onBlur: handleBlur }}
              form={{ errors, touched }}
              label="Customer Name (manual)"
              placeholder="Enter customer name manually"
            />
          </GridItem>
          <GridItem>
            <DatePickerField
              field={{ name: "createdAt", value: values.createdAt }}
              form={{ errors, touched, setFieldValue }}
              label="Created At"
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </GridItem>
          <GridItem>
            <DatePickerField
              field={{ name: "dueDate", value: values.dueDate }}
              form={{ errors, touched, setFieldValue }}
              label="Due Date"
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </GridItem>
        </Grid>

        <TextareaField
          field={{ name: "notes", value: values.notes, onChange: handleChange, onBlur: handleBlur }}
          form={{ errors, touched }}
          label="Notes"
          placeholder="Additional notes or comments..."
        />

        {/* Items Array */}
        {(() => {
          const push = (item) => {
            const newItems = [...values.items, item];
            setFieldValue("items", newItems);
          };
          const remove = (index) => {
            const newItems = values.items.filter((_, i) => i !== index);
            setFieldValue("items", newItems);
          };
          return (
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Items</Text>
                <Button size="sm" leftIcon={<AddIcon />} onClick={() => push({ description: "", qty: 1, price: 0, amount: 0 })}>Add Item</Button>
              </HStack>
              {values.items.map((it, idx) => {
                const amount = calcItemAmount(it.qty, it.price);
                return (
                  <Box key={idx} p={3} borderWidth="1px" borderRadius="md">
                    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr auto" }} gap={3} alignItems="center">
                      <GridItem>
                        <InputField
                          field={{
                            name: `items.${idx}.description`,
                            value: it.description,
                            onChange: (e) => setFieldValue(`items.${idx}.description`, e.target.value),
                            onBlur: handleBlur
                          }}
                          form={{ errors, touched }}
                          label=""
                          placeholder="Description"
                        />
                      </GridItem>
                      <GridItem>
                        <NumberInputFieldComponent
                          field={{
                            name: `items.${idx}.qty`,
                            value: it.qty,
                            onBlur: handleBlur
                          }}
                          form={{ errors, touched, setFieldValue }}
                          label=""
                          min={0}
                          placeholder="Qty"
                        />
                      </GridItem>
                      <GridItem>
                        <NumberInputFieldComponent
                          field={{
                            name: `items.${idx}.price`,
                            value: it.price,
                            onBlur: handleBlur
                          }}
                          form={{ errors, touched, setFieldValue }}
                          label=""
                          min={0}
                          placeholder="Price"
                        />
                      </GridItem>
                      <GridItem>
                        <Input value={formatCurrency(amount)} isReadOnly />
                      </GridItem>
                      <GridItem>
                        <IconButton aria-label="Remove" colorScheme="red" icon={<DeleteIcon />} onClick={() => remove(idx)} />
                      </GridItem>
                    </Grid>
                  </Box>
                );
              })}
            </VStack>
          );
        })()}

        <Divider />

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <NumberInputFieldComponent
              field={{ name: "taxRate", value: values.taxRate, onBlur: handleBlur }}
              form={{ errors, touched, setFieldValue }}
              label="Tax Rate (%)"
              min={0}
              max={100}
              placeholder="0"
            />
          </GridItem>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text>Subtotal</Text>
                  <Text fontWeight="bold">{formatCurrency(totals.subtotal)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Tax</Text>
                  <Text fontWeight="bold">{formatCurrency(totals.tax)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Total</Text>
                  <Text fontWeight="bold">{formatCurrency(totals.total)}</Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        <HStack>
          <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
        </HStack>

        <ModalWrapper title="New Customer" isOpen={custModal.isOpen} onClose={custModal.onClose}>
          <CustomerForm onSubmit={handleCustomerSubmit} />
        </ModalWrapper>
      </VStack>
    </form>
  );
}
