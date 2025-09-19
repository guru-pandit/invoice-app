import { uppercaseFirstLetter } from "@/utils/helpers";

export function invalidMessage(field) {
    return field ? `Invalid ${field}` : 'Invalid'
}

export function requiredMessage(field) {
    return field ? `${uppercaseFirstLetter(field)} is required!` : 'Required!'
}

export function atLeastMessage(field, length) {
    return `${uppercaseFirstLetter(field)} must be at least ${length} characters`
}