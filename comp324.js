
let cart = [];
let totalPrice = 0;

function addToCart(productId) {
    const product = document.getElementById(productId);
    const name = product.querySelector('h3').innerText;
    const price = parseFloat(product.querySelector('p').innerText.replace('$', ''));
    
    cart.push({ name, price });
    totalPrice += price;
    
    displayCart();
}

function removeFromCart(index) {
    const item = cart[index];
    totalPrice -= item.price;
    cart.splice(index, 1);
    
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.onclick = function() { removeFromCart(index); };
        li.appendChild(removeButton);

        cartItems.appendChild(li);
    });

    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}
// PayPal Button Integration
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalPrice.toFixed(2) // Use the total cart price
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
            cart = [];
            totalPrice = 0;
            displayCart();
        });
    },
    onError: function(err) {
        console.error('PayPal error:', err);
    }
}).render('#paypal-button-container');