export const loginInitialValues = { email: "", password: "" }
export const registerInitialValues = { email: "", password: "" }
export const resetPasswordInitialValues = { email: "" }

export const customerInitialValues = {
    name: "",
    email: "",
    phone: "",
}

export const invoiceInitialValues = {
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
}