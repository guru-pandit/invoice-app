"use client";
import React, { useMemo } from "react";
import { Box, Button, FormControl, FormLabel, Grid, GridItem, HStack, IconButton, Input, NumberInput, NumberInputField, Select, Stack, Text, Textarea, VStack, Divider, useDisclosure, useToast } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { calcItemAmount, calcTotals } from "@/utils/calc";
import { formatCurrency } from "@/utils/format";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import useCustomers from "@/hooks/useCustomers";
import ModalWrapper from "@/components/ModalWrapper";
import CustomerForm from "@/components/CustomerForm";
import DatePicker from "@/components/DatePicker";

const ItemSchema = Yup.object().shape({
  description: Yup.string().required("Required"),
  qty: Yup.number().min(0).required("Required"),
  price: Yup.number().min(0).required("Required"),
});

const InvoiceSchema = Yup.object().shape({
  number: Yup.string().required("Invoice number is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerEmail: Yup.string().email("Invalid email").required("Email is required"),
  status: Yup.string().oneOf(["draft", "sent", "paid", "overdue"]).required("Status is required"),
  items: Yup.array().of(ItemSchema).min(1, "At least one item is required"),
  taxRate: Yup.number().min(0).max(100).default(0),
});

export default function InvoiceForm({ initialValues, onSubmit, submitLabel = "Save Invoice" }) {
  const { customers, add: addCustomer } = useCustomers();
  const custModal = useDisclosure();
  const toast = useToast();
  const defaults = useMemo(
    () => ({
      number: "",
      customerId: "",
      customerName: "",
      customerEmail: "",
      notes: "",
      status: "draft",
      createdAt: new Date().toISOString().slice(0, 16),
      dueDate: "",
      taxRate: 0,
      items: [
        { description: "Item 1", qty: 1, price: 0, amount: 0 },
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
    }),
    []
  );

  const init = { ...defaults, ...(initialValues || {}) };

  return (
    <Formik
      initialValues={init}
      validationSchema={InvoiceSchema}
      onSubmit={(values, actions) => {
        const totals = calcTotals(values.items, values.taxRate);
        const payload = { ...values, ...totals };
        actions.setSubmitting(true);
        Promise.resolve(onSubmit(payload))
          .finally(() => actions.setSubmitting(false));
      }}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => {
        const totals = calcTotals(values.items, values.taxRate);
        return (
          <Form>
            <VStack align="stretch" spacing={6}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <GridItem>
                  <FormControl isInvalid={touched.number && errors.number}>
                    <FormLabel>Invoice Number</FormLabel>
                    <Input name="number" value={values.number} onChange={(e) => setFieldValue("number", e.target.value)} placeholder="INV-0001" />
                    {touched.number && errors.number ? (
                      <Text color="red.500" fontSize="sm">{errors.number}</Text>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select name="status" value={values.status} onChange={(e) => setFieldValue("status", e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>Customer</FormLabel>
                    <HStack>
                      <Select
                        placeholder="Select existing customer"
                        value={values.customerId || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          setFieldValue("customerId", id);
                          if (!id) return;
                          const c = customers.find((x) => x.id === id);
                          if (c) {
                            setFieldValue("customerName", c.name || "");
                            setFieldValue("customerEmail", c.email || "");
                          }
                        }}
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
                  <FormControl isInvalid={touched.customerEmail && errors.customerEmail}>
                    <FormLabel>Customer Email</FormLabel>
                    <Input type="email" name="customerEmail" value={values.customerEmail} onChange={(e) => setFieldValue("customerEmail", e.target.value)} />
                    {touched.customerEmail && errors.customerEmail ? (
                      <Text color="red.500" fontSize="sm">{errors.customerEmail}</Text>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FormControl isInvalid={touched.customerName && errors.customerName}>
                    <FormLabel>Customer Name (manual)</FormLabel>
                    <Input name="customerName" value={values.customerName} onChange={(e) => setFieldValue("customerName", e.target.value)} />
                    {touched.customerName && errors.customerName ? (
                      <Text color="red.500" fontSize="sm">{errors.customerName}</Text>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem>
                  <DatePicker
                    label="Created At"
                    selected={values.createdAt}
                    onChange={(d) => setFieldValue("createdAt", d ? new Date(d).toISOString() : "")}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                </GridItem>
                <GridItem>
                  <DatePicker
                    label="Due Date"
                    selected={values.dueDate}
                    onChange={(d) => setFieldValue("dueDate", d ? new Date(d).toISOString() : "")}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                </GridItem>
              </Grid>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea name="notes" value={values.notes} onChange={(e) => setFieldValue("notes", e.target.value)} />
              </FormControl>

              <FieldArray name="items">
                {({ push, remove }) => (
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
                              <Input placeholder="Description" value={it.description} onChange={(e) => setFieldValue(`items.${idx}.description`, e.target.value)} />
                            </GridItem>
                            <GridItem>
                              <NumberInput min={0} value={it.qty} onChange={(v) => setFieldValue(`items.${idx}.qty`, Number(v))}>
                                <NumberInputField placeholder="Qty" />
                              </NumberInput>
                            </GridItem>
                            <GridItem>
                              <NumberInput min={0} value={it.price} onChange={(v) => setFieldValue(`items.${idx}.price`, Number(v))}>
                                <NumberInputField placeholder="Price" />
                              </NumberInput>
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
                )}
              </FieldArray>

              <Divider />

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <GridItem>
                  <FormControl>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <NumberInput min={0} max={100} value={values.taxRate} onChange={(v) => setFieldValue("taxRate", Number(v))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
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
                <CustomerForm
                  onSubmit={async (cust) => {
                    try {
                      const id = await addCustomer(cust);
                      setFieldValue("customerId", id);
                      setFieldValue("customerName", cust.name || "");
                      setFieldValue("customerEmail", cust.email || "");
                      custModal.onClose();
                      toast({ status: "success", title: "Customer created" });
                    } catch (e) {
                      // handled in form toast
                    }
                  }}
                />
              </ModalWrapper>
            </VStack>
          </Form>
        );
      }}
    </Formik>
  );
}
