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
	btn.addEventListener('click', function() {
			ingresar_item();
	});
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

// This will be update with ingresar_item function
var order = {
	i_item: 0, // Keep the count of items appened to the order table. Important to update_order
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

function ingresar_item(itemSubmit, qtySumit) {
	console.log(arguments.length);
	var item;
	var qty;
	if (arguments.length > 0) {
		item = arguments[0];
		qty = arguments[1];
		console.log(item);
		console.log(qty);
	} else {
		item = document.getElementById('referencia').value.toLowerCase();
		qty = parseInt(document.getElementById('cantidad').value);
		console.log(qty);
	}
	var item_available = checkInventory(item, qty); // --> true or false

	if (item !== '' && qty > 0) {
		if (item_available) {
			var inOrderAlready = order.hasOwnProperty(item);
			console.log(inOrderAlready);
			if (inOrderAlready) {
				order[item] += parseInt(qty);
			} else {
				order[item] = parseInt(qty);
			}
			console.log(order);
			generar_resumen(item, qty);
			document.getElementById('referencia').value = '';
			document.getElementById('cantidad').value = '';
		} else {
			alert('Item is not available or quantity exceeds the stock!');
		}
	} else {
		alert('Debe ingresar un item y su cantidad!');
	}
}

// Esta function realmente solo funciona para crear elements con clases :( !!!
// Pendiente modificar para que se adapte según los argumentos

function createElement(tag, attribute, text) {
	var element = document.createElement(tag);
	var attr = attribute.split(' ');
	attr.map(function(e) {
		element.classList.add(e);
	});
	element.setAttribute('href', '#')
	element.appendChild(document.createTextNode(text));
	return element;
}

function generar_resumen(item, qty) {
	if (order.i_item == 0) {
	// Add 'edit' and 'clear' buttons:
		var edit_btn = createElement('a', 'button edit', 'Edit');
		edit_btn.setAttribute('id', 'edit_btn');
		var clear_btn = createElement('a', 'button clear', 'Clear');
		clear_btn.setAttribute('id', 'clear_btn');
		_HTML.append(edit_btn, 'cmd-buttons');
		_HTML.append(clear_btn, 'cmd-buttons');
		// --> buttons were appended
		handle_button_events(); // add functions to 'edit' and 'clear' buttons

		table_resumen = crear_tabla(); // Returns the table to append to the DOM just for one time
		_HTML.append(table_resumen, 'resume');
		update_order(item, qty);	// Append a <tr> every the "Ingresar" btn is clicked.
	} else {
		update_order(item, qty);
	}
}

function crear_tabla() {
	var div = document.createElement('div');
	div.setAttribute('class', 'pedido');
	var button = createElement('a', 'button calcular', 'Calcular');
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
	return (div);
}

function update_order(itemOrder, qtyOrder) {
	var row_item = document.createElement('tr');

	var td_item = document.createElement('td');
	// --> append input for each 'td' tag in order to edit if user click 'edit' buttton
	// --> inputs appended should have a class that hide the element, only visible when 'edit'
	var editableInputItem = document.createElement('input');
	editableInputItem.setAttribute('class', 'hidden');
	editableInputItem.setAttribute('type', 'text');
	editableInputItem.setAttribute('value', itemOrder);
	// Above will only display if 'edit' botton is clicked
	var item = document.createElement('div');
	item.appendChild(document.createTextNode(itemOrder));
	td_item.appendChild(editableInputItem); // --> Only visible if 'edit' button was clicked
	td_item.appendChild(item); // --> show this data by default

	var td_qty = document.createElement('td');
	var editableInputQty = document.createElement('input');
	editableInputQty.setAttribute('class', 'hidden');
	editableInputQty.setAttribute('type', 'text');
	editableInputQty.setAttribute('value', qtyOrder); // --> value of the index of the array inside the object 'order'.
	// Above will only display if 'edit' botton is clicked

	var qty = document.createElement('div');
	qty.appendChild(document.createTextNode(qtyOrder));
	td_qty.appendChild(editableInputQty); // --> Only visible if 'edit' button was clicked
	td_qty.appendChild(qty); // --> show this data by default

	// Insert the data in the row of the table
	row_item.appendChild(td_item);
	row_item.appendChild(td_qty);
	_HTML.append(row_item, 'tabla_pedido');
	console.log(order.i_item);
	order.i_item++;
}

function handle_button_events() {
	var editionComplete = false;
	var edit_button = document.getElementById('edit_btn');
	var editedInput; // Will be asigned with makeEditable()
	edit_button.addEventListener('click', function() {
		if (editionComplete) {
			// var return the editedInput = td.children[0] and pass as argument to restartEditedOrder
			// in order to update the order bedore printing again
			restartEditedOrder(editedInput);
		} else {
			makeEditable();
			editionComplete = true;
			editedInput = makeEditable(); // --> Collect the editedInputs
		}
	});
}

var makeEditable = function() {
	var orderResumeTable = document.getElementById('tabla_pedido');
	var dataFromOrderResume = orderResumeTable.getElementsByTagName('td');
	var editableInput = Array.from(dataFromOrderResume);

	function inputToUpdate() {
		var inputData = editableInput.map(function(td) {
			td.className = 'chooseToEdit';
			td.addEventListener('click', function() {
				var editedInput = td.children[0];
				td.children[0].className = 'edit_order'; // make visible the input field to edit the order
				td.children[1].className = 'hidden'; // hide the <div> that contains the innerText
			});
			return td.children[0];
		});
		return inputData; // --> for test only
	}
	var readyToEdit = inputToUpdate();
	return inputToUpdate(); // --> Invoke if have not been already
	console.log(readyToEdit);
}

function restartEditedOrder(arrayToEdit) {

	var cmdButtons = document.getElementById('cmd-buttons');
	var editButton = document.getElementById('edit_btn');
	var clearButton = document.getElementById('clear_btn');
	cmdButtons.removeChild(editButton);
	cmdButtons.removeChild(clearButton);
	document.getElementById('resume').innerHTML = '';
	order.i_item = 0;
	console.log(order);

	// Collect the editable input
	var orderPendingToUpdate = arrayToEdit.reduce(function(obj, input, i) {
		var isInOrderAlready = order.hasOwnProperty(input.value);
		if (i % 2 === 0) {
			var qtyInt = arrayToEdit[i + 1].value;
			if (!obj[input.value.toLowerCase()]) {
				order[input.value] = 0;
				obj[input.value.toLowerCase()] = parseInt(qtyInt);
			} else {
				obj[input.value.toLowerCase()] += parseInt(qtyInt);
			}
		}
		return obj;
	}, {});
	console.log(orderPendingToUpdate);

	for (var i in orderPendingToUpdate) {
		if(i !== 'i_item') {
			// generar_resumen(i, orderPendingToUpdate[i]);
			ingresar_item(i, orderPendingToUpdate[i]);
		}
	}
}
