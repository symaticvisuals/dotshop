const COLUMNS = [
    // 'id', 'name', 'description', 'price', 'quantity', 'image', 'categoryId', 'sellerId', 'rating', 'isAvailable', 'isFeatured', 'isOutOfStock', 'isLowStock', 'isSoldOut'
    {
        Header: 'Image',
        accessor: 'item.image',
    },

    {
        Header: 'Name',
        accessor: 'item.name',
    },
    {
        Header: 'Order Id',
        accessor: 'orderId',
    },
    {
        Header: 'Selling Price',
        accessor: 'sellingPrice',
    },
    {
        Header: 'Quantity',
        accessor: 'quantity',
    },
    {
        Header: 'Placed At',
        accessor: 'createdAt',
        // change the date format
        Cell: ({ value }) => {
            return new Date(value).toDateString();
        }

    },
];


export { COLUMNS };