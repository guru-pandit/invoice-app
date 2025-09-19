"use client";
import React from "react";
import { Button, Container, Heading, HStack, IconButton, Input, Stack, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import useCustomers from "@/hooks/useCustomers";
import ModalWrapper from "@/components/ModalWrapper";
import CustomerForm from "@/components/CustomerForm";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export default function CustomersPage() {
  const { customers, loading, add, update, remove } = useCustomers();
  const toast = useToast();
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [editing, setEditing] = React.useState(null);

  const startEdit = (c) => {
    setEditing(c);
    editModal.onOpen();
  };

  const stopEdit = () => {
    setEditing(null);
    editModal.onClose();
  };

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">Customers</Heading>
          <Button onClick={createModal.onOpen} colorScheme="teal">New Customer</Button>
        </HStack>

        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(customers || []).map((c) => (
              <Tr key={c.id}>
                <Td>{c.name}</Td>
                <Td>{c.email}</Td>
                <Td>{c.phone}</Td>
                <Td>
                  <HStack>
                    <IconButton aria-label="Edit" size="sm" icon={<EditIcon />} onClick={() => startEdit(c)} />
                    <IconButton aria-label="Delete" size="sm" colorScheme="red" icon={<DeleteIcon />} onClick={async () => { try { await remove(c.id); toast({ status: "success", title: "Customer deleted" }); } catch (e) { toast({ status: "error", title: "Delete failed", description: e.message }); } }} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ModalWrapper title="New Customer" isOpen={createModal.isOpen} onClose={createModal.onClose}>
          <CustomerForm onSubmit={async (vals) => { try { await add(vals); toast({ status: "success", title: "Customer created" }); createModal.onClose(); } catch (e) {} }} />
        </ModalWrapper>

        <ModalWrapper title="Edit Customer" isOpen={editModal.isOpen} onClose={stopEdit}>
          <CustomerForm initialValues={editing || {}} onSubmit={async (vals) => { try { await update(editing.id, vals); toast({ status: "success", title: "Customer updated" }); stopEdit(); } catch (e) {} }} submitLabel="Save Changes" />
        </ModalWrapper>
      </Stack>
    </Container>
  );
}
