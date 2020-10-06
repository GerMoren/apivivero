`RUTAS:`

`Crear una categoría nueva:`

POST /products/category/

Debe pasar por body si o si un `name` unico (no puede crear 2 categorias con el mismo name) y una `description` de la categoria a crear.

Se recibe como respuesta el siguiente objeto de ejemplo:

    {
    "id": 1,
    "name": "categoria_1",
    "description": "categoria",
    "updatedAt": "2020-08-22T18:47:51.534Z",
    "createdAt": "2020-08-22T18:47:51.534Z"
    }

`Modificar una Categoria:`

PUT /products/category/:id

Debe pasar por params el `ID` de la categoria a modificar.

Debe pasar por body un `name` y/o una `description` de la categoria a modificar.

Se recibe como respuesta el siguiente objeto de ejemplo:

    {
    "id": 1,
    "name": "categoria_1_modificada",
    "description": "descripcion modificada",
    "createdAt": "2020-08-22T19:05:16.318Z",
    "updatedAt": "2020-08-22T19:05:21.834Z"
    }

`Eliminar Categoria:`

DELETE /products/category/:id

Debe pasar por params el `ID` de la categoria a eliminar.

Se recibe como respuesta el siguiente objeto de ejemplo:

    {
    "message": "Categoria con id: 1 borrada satisfactoriamente"
    }

`Crear un nuevo Producto`

POST /products

Debe pasar por body si o si un `name`, una `description`, un `price` (numero positivo), el `stock` (no puede ser negativo) y una `image` (tendra una imagen por defecto en caso de ser nulo) del producto a crear.

Ademas debe recibir por body un array de `idCategoria` a las que pertenece el producto. Por ejemplo: `"idCategoria": [1,2]` para asignarle las categoria `id: 1` y `id: 2` al nuevo producto.

Se recibe como respuesta el siguiente objeto de ejemplo:

    {
    "id": 1,
    "name": "producto_1",
    "description": "producto 1",
    "price": "199.99",
    "image": "aqui va el buffer de la imagen",
    "stock": 10,
    "updatedAt": "2020-08-22T19:26:28.295Z",
    "createdAt": "2020-08-22T19:26:28.295Z"
    }

`Modificar un Producto:`

PUT /products/:id

Debe pasar por params el `ID` del producto a modificar.

Debe pasar por body un `name` y/o una `description` y/o un `price` y/o el `stock` y/o una `image`del producto a modificar.

Retorna 400 si los campos enviados no son correctos.

Ademas puede recibir por body un array de `idCategoria` a las que desea pertenecer el producto. Por ejemplo: `"idCategoria": [2]` para cambiarle la categoria existente por la categoria con `id: 2` al producto.

Retorna 200 si se modificó con exito, y se recibe como respuesta el siguiente objeto de ejemplo:

    {
    "id": 1,
    "name": "producto_1_modificado",
    "description": "producto 1 modificado",
    "price": "225.00",
    "image": "aqui va el buffer de la imagen",
    "stock": 20,
    "createdAt": "2020-08-22T19:26:28.295Z",
    "updatedAt": "2020-08-22T19:32:10.885Z"
    }

`Eliminar Producto:`

DELETE /products/:id

Debe pasar por params el `ID` del producto a eliminar.

Retorna 200 si se elimino con exito y recibe como respuesta el siguiente objeto de ejemplo:

    {
    "message": "Producto con id: 1 Borrado Satisfactoriamente"
    }

`Obtener todos los productos`

GET /products/

Devuelve un arreglo de productos. Aqui un ejemplo:

    [
        {
            "id": 1,
            "name": "producto_1",
            "description": "producto 1",
            "price": "199.99",
            "image": "aqui va el buffer de la imagen",
            "stock": 10,
            "createdAt": "2020-08-22T20:29:23.279Z",
            "updatedAt": "2020-08-22T20:29:23.279Z",
            "categories": [
                {
                    "id": 1,
                    "name": "categoria_1",
                    "description": "categoria",
                    "createdAt": "2020-08-22T20:29:14.934Z",
                    "updatedAt": "2020-08-22T20:29:14.934Z",
                    "category_products": {
                        "createdAt": "2020-08-22T20:29:23.440Z",
                        "updatedAt": "2020-08-22T20:29:23.440Z",
                        "categoryId": 1,
                        "productId": 1
                    }
                }
            ]
        },
        {
            "id": 2,
            "name": "producto_2",
            "description": "producto 2",
            "price": "199.99",
            "image": "aqui va el buffer de la imagen",
            "stock": 10,
            "createdAt": "2020-08-22T20:29:40.073Z",
            "updatedAt": "2020-08-22T20:29:40.073Z",
            "categories": [
                {
                    "id": 1,
                    "name": "categoria_1",
                    "description": "categoria",
                    "createdAt": "2020-08-22T20:29:14.934Z",
                    "updatedAt": "2020-08-22T20:29:14.934Z",
                    "category_products": {
                        "createdAt": "2020-08-22T20:29:40.795Z",
                        "updatedAt": "2020-08-22T20:29:40.795Z",
                        "categoryId": 1,
                        "productId": 2
                    }
                }
            ]
        }
    ]

`Obtener los detalles de un producto`

GET /products/:id

Debe pasar por params el `ID` del producto a obtener.

Retorna un objeto de tipo producto con todos sus datos. (Incluidas las categorías e imagenes). Aqui un ejemplo:

    {
    "id": 1,
    "name": "producto_1",
    "description": "producto 1",
    "price": "199.99",
    "image": "aqui va el buffer de la imagen",
    "stock": 10,
    "createdAt": "2020-08-22T19:47:50.714Z",
    "updatedAt": "2020-08-22T19:47:50.714Z",
    "categories":
            [
                {
                "id": 1,
                "name": "categoria_1",
                "description": "categoria",
                "createdAt": "2020-08-22T19:47:47.566Z",
                "updatedAt": "2020-08-22T19:47:47.566Z",
                "category_products":
                    {
                    "createdAt": "2020-08-22T19:47:50.788Z",
                    "updatedAt": "2020-08-22T19:47:50.788Z",
                    "categoryId": 1,
                    "productId": 1
                    }
                }
            ]
    }

`Obtener los productos de X Categoria`

GET /products/categoria/:nombreCat

Debe pasar por params el `nombreCat` del producto a obtener.

Retorna todos los productos de {nombreCat} Categoría.

Retorna un arreglo de productos. (Incluidas las relaciones con las categorias). Aqui un ejemplo:

    [
        {
            "id": 1,
            "name": "producto_1",
            "description": "producto 1",
            "price": "199.99",
            "image": "aqui va el buffer de la imagen",
            "stock": 10,
            "createdAt": "2020-08-22T20:29:23.279Z",
            "updatedAt": "2020-08-22T20:29:23.279Z",
            "category_products":
                {
                    "createdAt": "2020-08-22T20:29:23.440Z",
                    "updatedAt": "2020-08-22T20:29:23.440Z",
                    "categoryId": 1,
                    "productId": 1
                }
        },
        {
            "id": 2,
            "name": "producto_2",
            "description": "producto 2",
            "price": "199.99",
            "image": "aqui va el buffer de la imagen",
            "stock": 10,
            "createdAt": "2020-08-22T20:29:40.073Z",
            "updatedAt": "2020-08-22T20:29:40.073Z",
            "category_products":
                {
                    "createdAt": "2020-08-22T20:29:40.795Z",
                    "updatedAt": "2020-08-22T20:29:40.795Z",
                    "categoryId": 1,
                    "productId": 2
                }
        }
    ]

`Agregar la categoria a un producto:`

POST /products/:idProducto/category/:idCategoria

Debe pasar por params el `ID` del producto que necesita asignarle una nueva categoria. Tambien debe pasar por params el `ID` de la categoria.

`Elimina la categoria a un producto:`

DELETE /products/:idProducto/category/:idCategoria

Debe pasar por params el `ID` del producto que necesita eliminarle la categoria. Tambien debe pasar por params el `ID` de la categoria.
