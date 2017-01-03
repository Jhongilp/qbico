window.onload = function() {
	initialize();
}

function initialize() {
	var btn = document.getElementById('btn');
	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			ingresar_item();
		}
	});
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

var order = {
	i_item: 0,
	items: [],
	order_qty: []
}

var _HTML = {
	inner: function(content, dom_location) {
		document.getElementById(dom_location).innerHTML = content;
	},
	append: function(content, dom_location) {
		document.getElementById(dom_location).appendChild(content);
	}
}

function ingresar_item() {
	var item = document.getElementById('referencia').value;
	var qty = document.getElementById('cantidad').value;
	var table_resumen;
	if (item !== '' && qty > 0) {
		order.items.push(item)
		order.order_qty.push(qty);
		generar_resumen();
		document.getElementById('referencia').value = '';
		document.getElementById('cantidad').value = '';
	} else {
		alert('Debe ingresar un item y su cantidad!');
	}
}

function generar_resumen() {
	if (order.items.length == 1) {
		table_resumen = crear_tabla(); // Returns the table to append to the DOM just for one time
		_HTML.append(table_resumen, 'resume');
		update_order();	// Append a <tr> every the "Ingresar" btn is clicked.
	} else {
		update_order();
	}
}

function crear_tabla() {
	var div = document.createElement('div');
	div.setAttribute('class', 'pedido');
	var button = document.createElement('a');
	button.setAttribute('class', 'button');
	button.appendChild(document.createTextNode('Calcular'));

	var table = document.createElement('table');
	// Create and append the head of the table
	var thead = document.createElement('thead');
	thead.innerHTML = '<tr><th>Items</th><th>Quantity</th></tr>';
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	tbody.setAttribute('id', 'tabla_pedido');
	
	table.appendChild(tbody);
	div.appendChild(table);
	div.appendChild(button);
	console.log(table);
	return (div);
}

function update_order() {
	var row_item = document.createElement('tr');
	var td_item = document.createElement('td');
	var item = document.createTextNode(order.items[order.i_item]);
	td_item.appendChild(item);
	var td_qty = document.createElement('td');
	var qty = document.createTextNode(order.order_qty[order.i_item]);
	td_qty.appendChild(qty);
	// Insert the data in the row of the table
	row_item.appendChild(td_item);
	row_item.appendChild(td_qty);
	_HTML.append(row_item, 'tabla_pedido');
	console.log(order.i_item);
	order.i_item++;
}


// En cuanto a los objetos, ver la posibilidad de llevar el inventario desde los objectos y no desde los arrays
// Por ejemplo, cuando el usuario ingresa, validar que la referencia exista y agregar la cantidad correspondiente
// al value of the key: {"Cuñete": 100}, + cuñete : 100, entonces order.items["Cuñete"] agregarle 100 al pedido
