import { products } from "@/data/products";

export function getProducts({
  search = "",
  consoleFilter = "",
  category = "",
  order = "recent",
}) {
  let result = [...products];

  // Busca
  if (search) {
    result = result.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Console
  if (consoleFilter) {
    result = result.filter(
      (product) => product.console === consoleFilter
    );
  }

  // Categoria
  if (category) {
    result = result.filter(
      (product) => product.category === category
    );
  }

  // Ordenação
  switch (order) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;

    case "name":
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    default:
      break;
  }

  return result;
}