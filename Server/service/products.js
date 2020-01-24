const ourProducts = require("../api/data.json");

const productsFunctions = {
  getProducts: () => ourProducts,
  getProductsFromArrayOfIds: arr => {
    let totalProducts = [];
  arr = typeof arr === 'string' ? JSON.parse(arr) : arr
    arr.map(
      idToCheck =>
        (totalProducts = totalProducts.concat(
          ourProducts.products.filter(({ id }) => id === idToCheck)
        ))
    );
    return totalProducts;
  }
};

module.exports = productsFunctions;
