window.onload = function() {
	initialize();
}

function initialize() {
	var btn = document.getElementById('btn');
	btn.addEventListener('click', ingresar_item);
}

var ref_producto = [
	cuñete = {
		peso: 27,
		dimensiones: {
			largo: 26,
			ancho: 28,
			alto: 36
		}
	},
	medio_cuñete = {
		peso: 14,
		dimensiones: {
			largo: 24,
			ancho: 25,
			alto: 25
		}
	}
];

function print_HTML(content, dom_location) {
	document.getElementById(dom_location).innerHTML = '';
	document.getElementById(dom_location).appendChild(content);
}

var order = {
	items: [],
	order_qty: []
}

// Tips para modificar:
// Actualmente se está reproduciendo todo el proceso, mejor:
// Crear varias modulos: crearTabla() si es el primer item,
// Despúes, aplicar function para agregar items a la tabla ya creada, para eso es útil appendChild

// En cuanto a los objetos, ver la posibilidad de llevar el inventario desde los objectos y no desde los arrays
// Por ejemplo, cuando el usuario ingresa, validar que la referencia exista y agregar la cantidad correspondiente
// al value of the key: {"Cuñete": 100}, + cuñete : 100, entonces order.items["Cuñete"] agregarle 100 al pedido

function ingresar_item() {
	var item = document.getElementById('referencia').value;
	var qty = document.getElementById('cantidad').value;
	var table_resumen;
	if (item !== '' && qty > 0) {
		// Create the table just once if it did not existed already
		if (order.items.length < 1) {
			
			console.log('Create table');
		}
		order.items.push(item)
		order.order_qty.push(qty);
		table_resumen = generar_resumen();
		print_HTML(table_resumen, 'resume');
	} else {
		alert('Debe ingresar un item y su cantidad!');
	}
	console.log(order);
}

function generar_resumen() {
	var div = document.createElement('div');
	div.setAttribute('class', 'pedido');
	var button = document.createElement('button');
	button.appendChild(document.createTextNode('Calcular'));

	var table = document.createElement('table');
	// Create and append the head of the table
	var thead = document.createElement('thead');
	thead.innerHTML = '<tr><th>Items</th><th>Quantity</th></tr>';
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	// Insert data to the table's body
	for (var i = 0; i < order.items.length; i++) {
		var row_item = document.createElement('tr');
		// Insert the reference item
		var td_item = document.createElement('td');
		var item = document.createTextNode(order.items[i]);
		td_item.appendChild(item);
		// Insert the quantity
		var td_qty = document.createElement('td');
		var qty = document.createTextNode(order.order_qty[i]);
		td_qty.appendChild(qty);
		// Insert the data in the row of the table
		row_item.appendChild(td_item);
		row_item.appendChild(td_qty);
		tbody.appendChild(row_item);
	}
	table.appendChild(tbody);
	div.appendChild(table);
	div.appendChild(button);
	console.log(table);
	return(div);
}


