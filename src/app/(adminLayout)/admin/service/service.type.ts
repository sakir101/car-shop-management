export type T_Service = {
    title: string,
    code: string,
    description: string,
    labour?: Array<T_labour>,
    parts?: Array<T_Part>,
}

export type T_labour = {
    name: string,
    labour: string,
    hourlyRate: string,
    totalAmount: string,
}

export type T_Part = {
    name: string,
    unit: string,
    price: string,
}
