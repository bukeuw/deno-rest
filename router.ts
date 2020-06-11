import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getProducts,
  addProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/products.ts";

const router = new Router();

router.get("/products", getProducts);
router.post("/products", addProducts);
router.get("/products/:id", getProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
