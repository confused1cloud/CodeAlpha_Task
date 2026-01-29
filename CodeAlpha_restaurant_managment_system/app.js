const API_URL = "http://localhost:3000";

// 1. REGISTER
async function register(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    console.log(data.message);
}


async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        // This is like the "Auth" tab in Postman
        localStorage.setItem("token", data.token); 
        alert("Logged in!");
    } else {
        alert(data.message);
    }
}

// 3. CREATE ORDER (Use the saved token)
async function placeOrder(itemsArray) {
    const token = localStorage.getItem("token");
    
    if (!token) return alert("Please login first!");

    const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ items: itemsArray })
    });

    const data = await response.json();
    alert(data.message);
}