import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Product } from "../types.ts";
import { database } from "../config.ts";

const client = new Client(database);

let products: Product[] = [
  {
    id: 1,
    name: "Advance upgrade material",
    price: 14,
  },
  {
    id: 2,
    name: "Honkai core",
    price: 50,
  },
  {
    id: 3,
    name: "Nuada revenge",
    price: 2800,
  },
  {
    id: 4,
    name: "Augmenter core",
    price: 300,
  },
];

/**
 * @desc Get all products
 *
 * @route GET /products
 */
export const getProducts = async ({ response }: { response: any }) => {
    try {
      let products = new Array();
      await client.connect();

      let result = await client.query("SELECT * FROM products");
      result.rows.map(p => {
        let obj: any = new Object();

        result.rowDescription.columns.map((el, i) => {
          obj[el.name] = p[i]
        })

        products.push(obj)
      })

      response.type = "application/json";
      response.body = {
        success: true,
        data: {
          success: true,
          data: products,
        },
      };
    } catch(err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString()
      }
    } finally {
      await client.end();
    }
};

/**
 * @desc Add product
 *
 * @route POST /products
 */
export const addProducts = async (
  { request, response }: { request: any; response: any },
) => {
  let data = await request.body();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      message: "bad request",
    };
  } else {
    let product = data.value;

    try {
      await client.connect();

      await client.query(
        "INSERT INTO products(name, description, price) VALUES($1, $2, $3)",
        product.name,
        product.description,
        product.price
      );

      response.type = "application/json";
      response.body = {
        success: true,
        data: {
          success: true,
          data: product,
        },
      };
    } catch(err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString()
      }
    } finally {
      await client.end();
    }
  }
};

/**
 * @desc Get a product
 *
 * @route GET /products/:id
 */
export const getProduct = async (
  { params, response }: { params: { id: string }; response: any },
) => {
    try {
      await client.connect();

      let result = await client.query("SELECT * FROM products WHERE id=$1", params.id);

      if (!result.rowCount) {
        response.status = 404;
        response.body = {
          success: false,
          message: "Product not found"
        };
      } else {
        let product: any = new Object();

        result.rows.map(p => {
          result.rowDescription.columns.map((el, i) => {
            product[el.name] = p[i]
          })
        })

        response.type = "application/json";
        response.body = {
          success: true,
          data: {
            success: true,
            data: product,
          },
        };
      }
    } catch(err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString()
      }
    } finally {
      await client.end();
    }
};

/**
 * @desc Update product
 *
 * @route PUT /products/:id
 */
export const updateProduct = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  let product: Product | undefined =
    products.filter((p) => p.id === parseInt(params.id))[0];

  if (!product) {
    response.status = 404;
    response.body = {
      success: false,
      message: "Product not found",
    };
  } else {
    let data = await request.body();
    let updateData: { name?: string; price?: number } = data.value;
    products = products.map((p) =>
      p.id === parseInt(params.id) ? { ...p, ...updateData } : p
    );

    response.type = "application/json";
    response.body = {
      success: true,
      data: product,
    };
  }
};

/**
 * @desc Delete product
 *
 * @route DELETE /products/:id
 */
export const deleteProduct = (
  { params, response }: { params: { id: string }; response: any },
) => {
  let index = products.findIndex((p) => p.id === parseInt(params.id));

  if (index === -1) {
    response.status = 404;
    response.body = {
      success: false,
      message: "Product not found",
    };
  } else {
    let deletedProduct = products[index];
    products = products.filter((p) => p.id !== parseInt(params.id));
    response.type = "application/json";
    response.body = {
      success: true,
      data: deletedProduct,
    };
  }
};
