const initialValues = {
    name: '',
    description: '',
    price: '',
    image: '',
    quantity: '',
    sellerId: '',
    categoryId: '',
}

const NOT_NULL_SCHEMA = [
    'name',
    'description',
    'price',
    'image',
    'quantity',
    'sellerId',
    'categoryId',
]

const ITEM_SCHEMA = {
    name: 'string',
    description: 'string',
    price: 'number',
    image: 'string',
    quantity: 'number',
    sellerId: 'number',
    categoryId: 'number',
}

export {
    initialValues,
    NOT_NULL_SCHEMA,
    ITEM_SCHEMA,
}