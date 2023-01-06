const COLUMNS = [
    // 'id', 'name', 'description', 'price', 'quantity', 'image', 'categoryId', 'sellerId', 'rating', 'isAvailable', 'isFeatured', 'isOutOfStock', 'isLowStock', 'isSoldOut'
    {
        Header: 'Image',
        accessor: 'image',
    },

    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Price',
        accessor: 'price',
    },
    {
        Header: 'Quantity',
        accessor: 'quantity',
    },

    {
        Header: 'Category',
        accessor: 'category.name',
    },



];


export { COLUMNS };