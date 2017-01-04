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

var inventory = {
	cuñete: {
		cantidad: 1500,
		color: ['yellow', 'blue', 'green', 'white'],
		weight: 27,
		measure: {
			l: 26,
			w: 26,
			h: 36
		}
	},
	medio_cuñete: {
		cantidad: 2000,
		color: ['yellow', 'blue', 'green', 'white'],
		weight: 20,
		measure: {
			l: 18,
			w: 18,
			h: 25
		}
	},
	galon: {
		cantidad: 5000,
		color: ['yellow', 'blue', 'green', 'white'],
		weight: 10,
		measure: {
			l: 10,
			w: 10,
			h: 20
		}
	},
	bulto: {
		cantidad: 1000,
		color: ['yellow', 'blue', 'green', 'white'],
		weight: 40,
		measure: {
			l: 30,
			w: 20,
			h: 10
		}
	}
};

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

var checkInventory = function(item, qty) {
	// First check if item exist, if so then check the quantity, both conditions must be true, otherwhise will be false
	var item_exist = inventory.hasOwnProperty(item);
	var stock = item_exist ? inventory[item].cantidad > qty : false;
	return stock;
};

function ingresar_item() {
	var item = document.getElementById('referencia').value.toLowerCase();
	var qty = document.getElementById('cantidad').value;
	var item_available = checkInventory(item, qty); // --> true or false

	if (item !== '' && qty > 0) {
		item_available ? (
			console.log('An item was added: ' + item),
			order.items.push(item),
			order.order_qty.push(qty),
			generar_resumen(),
			document.getElementById('referencia').value = '',
			document.getElementById('cantidad').value = ''
		) : (
			alert('Item is not available or quantity exceeds the stock!')
		)
	} else { alert('Debe ingresar un item y su cantidad!')}
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
