/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
        async agregarProducto(sku, cantidad) {
        
        try {// En caso de que el producto no exista me manda al catch con el mensaje de error.

        console.log(`Agregando ${cantidad} unidades de ${sku}`);

        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado:", producto.nombre);

        //Verifico si el producto ya está en el carrito
        const buscarEnCarrito = await this.productos.find(element => element.sku === sku);

        if (buscarEnCarrito) { // El producto ya está en el carrito

            // Busco el indice del producto en el carrito.
            const productosDelCarrito = this.productos;
            const buscarIndice = function() {

            for (let i = 0; i < productosDelCarrito.length; i++) {
                if (sku === productosDelCarrito[i].sku) {
                    return i;
                } else {}
            };
        };

            const indice = buscarIndice();

            // Le sumo la cantidad de unidades al producto ya existente.
            this.productos[indice].cantidad = this.productos[indice].cantidad + cantidad;
            this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            console.log(`Se le han sumado ${cantidad} unidad/es al producto`, this);
            
        } else { // El producto no está en el carrito.
            
            // Sumo un producto nuevo
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad, producto.categoria);
            this.productos.push(nuevoProducto);
            this.precioTotal = this.precioTotal + (producto.precio * cantidad);

            // Busco si la categoria ya existe en el carrito
            if (!this.categorias.find(cat => cat === producto.categoria)) {

                // Si no existe la agrego:
                this.categorias.push(producto.categoria);

            }; // Si ya existe, no hago nada.

            console.log("El producto fue añadido exitosamente.", this);
        }

    } catch (error){
        console.log(error);
        }
    }


    // ELIMINAR PRODUCTO -----------------------------------------------------------------------------------------


    eliminarProducto(sku, cantidad) {

        return new Promise ((resolve, reject) => {

            // Checkeo que el producto esté en el carrito
            const buscarEnCarrito = this.productos.find(element => element.sku === sku);

            if (buscarEnCarrito) {

                // Obtengo el nombre del producto
                const producto = productosDelSuper.find(product => product.sku === sku);

                console.log("Eliminando el producto " + producto.nombre);
        
                // Guardo en una const los productos del carrito para ingresarlos a la funcion buscarIndice.
                const productosDelCarrito = this.productos;

                // Busco el indice del producto en el carrito.
                const buscarIndice = function() {
        
                    for (let i = 0; i < productosDelCarrito.length; i++) {
                        if (sku === productosDelCarrito[i].sku) {
                            return i;
                        } else {}
                    }
                }

                const indice = buscarIndice();            

                // Si la cantidad es menor a la que hay en el carrito:
                if (cantidad < this.productos[indice].cantidad) {

                // Descuento la cantidad requerida del producto
                this.productos[indice].cantidad = this.productos[indice].cantidad - cantidad;
                // Actualizo el precio total
                this.precioTotal = this.precioTotal - cantidad * producto.precio;

                resolve("Se descontó la cantidad solicitada del producto.");

                console.log ("Se descontó la cantidad solicitada del producto", this);

                // Si la cantidad es mayor o igual:
                } else if (cantidad >= this.productos[indice].cantidad) {
                
                    // Verifico si hay más productos con la misma categoria
                    const numCategories = this.productos.filter(element => element.categoria === producto.categoria);
                    
                    // Si es el unico producto de su categoria, elimino la categoria
                    if (numCategories.length = 1) {
                        // Indentifico el indice de la categoria que se va a eliminar.
                        const indexCategoria = this.categorias.indexOf(producto.categoria);
                        // Elimino la categoria del carrito
                        this.categorias.splice(indexCategoria, 1);

                        // Si hay mas productos de su categoria, no hago nada.
                        } else {}

                        // Actualizo el precio total del carrito
                        this.precioTotal = this.precioTotal - this.productos[indice].cantidad * producto.precio;
                        // Por ultimo elimino el producto
                        this.productos.splice(indice, 1);

                        console.log("Producto eliminado exitosamente", this);

                        resolve("producto eliminado exitosamente");

                } else {
                    reject("error desconocido");
                }

            } else {

                reject("El producto que se quiere eliminar no esta en el carrito.");

                console.log("El producto que se quiere eliminar no esta en el carrito.");

            }

        }); // Promise

    } // eliminarProducto

} // class Carrito




// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito
    categoria;

    constructor(sku, nombre, cantidad, categoria) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }

}

// Función que busca un producto por su sku en "la base de datos"

function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Producto ${sku} no encontrado!`);
            }
        }, 500);
    });
}

const carrito = new Carrito();

carrito.agregarProducto('WE328NJ', 2) // Agregando 2 un. de Jabon.

    .then(() => carrito.agregarProducto('WE328NJ', 2)) // Ex 1.A - Agrego 2 un. más de Jabon.
    .then(() => carrito.agregarProducto('OL883YE', 2)) // Ex 1.B - Agrego 2 un. de Shampoo (misma categoria).
    .then(() => carrito.agregarProducto('INEXISTENTE', 1)) // Ex 1.C - Intento agregar un producto inexistente.
    .then(() => carrito.eliminarProducto('WE328NJ', 3)) // Ex 2.A, 2.B - Llamo a la funcion eliminarProducto con los parametros sku y cantidad. Le resto 3 un. a Jabon.
    .then(() => carrito.eliminarProducto('OL883YE', 3)) // Ex 2.C - Elimino el producto Shampoo colocando una cantidad mayor de la que habia en el carrito.
    .then(() => carrito.eliminarProducto('INEXISTENTE', 1)) // Ex 2.D - Trato de eliminar un producto que no está en el carrito.
    .catch((error) => {
        console.log(error + " (Catch)");
    });