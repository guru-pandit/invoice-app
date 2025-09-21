import { uppercaseFirstLetter } from "@/utils/helpers";

export const invoice = {
    CREATED: 'Invoice sucessfully created!'
}

export function invalidMessage(field) {
    return field ? `Invalid ${field}` : 'Invalid'
}

export function requiredMessage(field) {
    return field ? `${uppercaseFirstLetter(field)} is required!` : 'Required!'
}

export function atLeastMessage(field, length) {
    return `${uppercaseFirstLetter(field)} must be at least ${length} characters`
}

export function minValueMessage(field, value) {
    return `${uppercaseFirstLetter(field)} must be at least ${value}`
}

export function maxValueMessage(field, value) {
    return `${uppercaseFirstLetter(field)} cannot exceed ${value}`
}

export function minMaxMessage(field, min, max) {
    return `${uppercaseFirstLetter(field)} must be between ${min} and ${max}`
}

export function greaterThanMessage(field, value) {
    return `${uppercaseFirstLetter(field)} must be greater than ${value}`
}

export function lessThanMessage(field, value) {
    return `${uppercaseFirstLetter(field)} must be less than ${value}`
}

export function equalToMessage(field, value) {
    return `${uppercaseFirstLetter(field)} must be equal to ${value}`
}

export function notEqualToMessage(field, value) {
    return `${uppercaseFirstLetter(field)} must not be equal to ${value}`
}