const menuItems = [
    { id: 1, name: "Оши Палави Ошхонагӣ", category: "mains", price: 35, time: 15, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80", desc: "Гӯшти гӯсфанд, биринҷи аъло, сабзии зард ва нахӯд." },
    { id: 2, name: "Қуротоби Хуҷандӣ", category: "mains", price: 30, time: 10, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80", desc: "Қуротоби асил бо равғани зағер, фатир ва кабудӣ." },
    { id: 3, name: "Шашлики Гӯшти Модён", category: "kebabs", price: 25, time: 20, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80", desc: "Шашлики мулоим ва нарм бо пиёз ва сирко." },
    { id: 4, name: "Пиццаи Пепперони", category: "fastfood", price: 65, time: 25, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80", desc: "Пицца бо колбасаи пепперони ва панири Моцарелла." },
    { id: 5, name: "Чизбургер XXL", category: "fastfood", price: 35, time: 15, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", desc: "Котлети калони гӯштӣ, панир, помидор ва соуси махсус." },
    { id: 6, name: "Манту бо Гӯшт (5 дона)", category: "mains", price: 25, time: 20, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80", desc: "Мантуи буғӣ бо гӯшти майдакардашуда ва пиёз." },
    { id: 7, name: "Лимонади Хандон (1л)", category: "drinks", price: 18, time: 5, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80", desc: "Лимонади табиӣ бо ях ва наъно." },
    { id: 8, name: "Чойи Сиёҳ / Чойи Кӯк", category: "drinks", price: 5, time: 3, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80", desc: "Чойи хушбӯй дар чойник." },
    { id: 9, name: "Чизкейки Классикӣ", category: "desserts", price: 22, time: 5, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80", desc: "Десерти мулоими панирӣ бо соуси мевагӣ." },
    { id: 10, name: "Лағмони Уйғурӣ", category: "mains", price: 28, time: 18, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80", desc: "Хамири дастӣ бо сабзавот ва гӯшти бирёншуда." },
    { id: 11, name: "Шашлики Ҷигар", category: "kebabs", price: 20, time: 15, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80", desc: "Ҷигари тозаи гов бо дунба." },
    { id: 12, name: "Мороженое Ассорти", category: "desserts", price: 15, time: 5, img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&q=80", desc: "Се шарики яхмос бо топингҳои гуногун." }
];

let currentTable = "1";
let currentCategory = "all";
let cart = [];
let orders = JSON.parse(localStorage.getItem('restaurant_orders')) || [];
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderMenu();
    updateCartUI();
    renderKitchenBoard();
    renderGuestOrders();
    
    timerInterval = setInterval(() => {
        updateTimers();
    }, 1000);
});

function switchMode(mode) {
    const guestView = document.getElementById('guest-view');
    const kitchenView = document.getElementById('kitchen-view');
    const cartBar = document.getElementById('cart-bar');
    const guestBtn = document.getElementById('nav-guest-btn');
    const kitchenBtn = document.getElementById('nav-kitchen-btn');
    const tableWrap = document.getElementById('table-selector-wrap');

    if (mode === 'guest') {
        guestView.classList.remove('hidden');
        kitchenView.classList.add('hidden');
        if(cart.length > 0) cartBar.classList.remove('translate-y-full');
        tableWrap.classList.remove('hidden');

        guestBtn.className = "px-3 py-1.5 rounded-md bg-white text-amber-900 shadow transition-all flex items-center gap-1.5 font-medium";
        kitchenBtn.className = "px-3 py-1.5 rounded-md text-amber-100 hover:text-white transition-all flex items-center gap-1.5 relative font-medium";
    } else {
        guestView.classList.add('hidden');
        kitchenView.classList.remove('hidden');
        cartBar.classList.add('translate-y-full');
        tableWrap.classList.add('hidden');

        kitchenBtn.className = "px-3 py-1.5 rounded-md bg-white text-amber-900 shadow transition-all flex items-center gap-1.5 relative font-medium";
        guestBtn.className = "px-3 py-1.5 rounded-md text-amber-100 hover:text-white transition-all flex items-center gap-1.5 font-medium";
        
        renderKitchenBoard();
    }
}

function changeTable(val) {
    currentTable = val;
    document.getElementById('cart-modal-table').innerText = val;
    renderGuestOrders();
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-amber-600', 'text-white', 'border-amber-600');
        btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
    });
    
    event.target.classList.add('active', 'bg-amber-600', 'text-white', 'border-amber-600');
    event.target.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
    
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const filtered = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "food-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="relative h-48 overflow-hidden">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                        <i data-lucide="clock" class="w-3 h-3 text-amber-400"></i>
                        ~${item.time} дақиқа
                    </span>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 text-lg mb-1">${item.name}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-3">${item.desc}</p>
                </div>
            </div>
            <div class="p-4 pt-0 flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">${item.price} <span class="text-xs font-normal text-gray-500">TJS</span></span>
                <button onclick="addToCart(${item.id})" class="bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-600 p-2.5 rounded-xl transition-all flex items-center gap-1 font-medium text-xs">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    <span>Илова кардан</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function addToCart(id) {
    const item = menuItems.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
}

function changeQty(id, delta) {
    const index = cart.findIndex(c => c.id === id);
    if (index !== -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const maxTime = cart.length > 0 ? Math.max(...cart.map(i => i.time)) : 0;

    document.getElementById('cart-count-badge').innerText = totalCount;
    document.getElementById('cart-total-price').innerText = `${totalPrice} TJS`;
    document.getElementById('cart-modal-total').innerText = `${totalPrice} TJS`;
    document.getElementById('cart-max-time').innerText = `~${maxTime} дақиқа`;

    if (totalCount > 0 && document.getElementById('guest-view').classList.contains('hidden') === false) {
        cartBar.classList.remove('translate-y-full');
    } else {
        cartBar.classList.add('translate-y-full');
    }

    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = `<p class="text-center text-gray-400 py-8 text-sm">Сабад холӣ аст</p>`;
    } else {
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = "flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100";
            el.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${item.img}" class="w-12 h-12 object-cover rounded-lg">
                    <div>
                        <h4 class="font-bold text-xs text-gray-800">${item.name}</h4>
                        <p class="text-xs text-amber-600 font-bold">${item.price} TJS</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
                    <button onclick="changeQty(${item.id}, -1)" class="text-gray-500 hover:text-red-500 font-bold px-1">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)" class="text-gray-500 hover:text-green-500 font-bold px-1">+</button>
                </div>
            `;
            list.appendChild(el);
        });
    }
}

function toggleCartModal(show) {
    const modal = document.getElementById('cart-modal');
    const content = document.getElementById('cart-modal-content');

    if (show) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('translate-x-full');
    } else {
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.add('translate-x-full');
    }
}

function submitOrder() {
    if (cart.length === 0) return;

    const maxTime = Math.max(...cart.map(i => i.time));
    
    const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        table: currentTable,
        items: [...cart],
        totalPrice: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
        estimatedTime: maxTime,
        elapsedSeconds: 0,
        status: 'new',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    orders.push(newOrder);
    saveOrders();

    cart = [];
    updateCartUI();
    toggleCartModal(false);

    renderGuestOrders();
    renderKitchenBoard();

    playNotificationSound();
    alert(`Фармоиши шумо қабул шуд! Ошпазҳо онро омода месозанд.`);
}

function saveOrders() {
    localStorage.setItem('restaurant_orders', JSON.stringify(orders));
    updateKitchenBadge();
}

function updateKitchenBadge() {
    const newCount = orders.filter(o => o.status === 'new').length;
    const badge = document.getElementById('kitchen-badge');
    if (newCount > 0) {
        badge.innerText = newCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderKitchenBoard() {
    const colNew = document.getElementById('column-new');
    const colPrep = document.getElementById('column-preparing');
    const colReady = document.getElementById('column-ready');

    colNew.innerHTML = '';
    colPrep.innerHTML = '';
    colReady.innerHTML = '';

    let cNew = 0, cPrep = 0, cReady = 0;

    orders.forEach(order => {
        const card = createKitchenCard(order);

        if (order.status === 'new') {
            colNew.appendChild(card);
            cNew++;
        } else if (order.status === 'preparing') {
            colPrep.appendChild(card);
            cPrep++;
        } else if (order.status === 'ready') {
            colReady.appendChild(card);
            cReady++;
        }
    });

    document.getElementById('count-new').innerText = cNew;
    document.getElementById('count-preparing').innerText = cPrep;
    document.getElementById('count-ready').innerText = cReady;

    updateKitchenBadge();
    lucide.createIcons();
}

function createKitchenCard(order) {
    const div = document.createElement('div');
    div.className = "bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between space-y-3";

    const itemsHtml = order.items.map(i => `<li class="text-xs font-semibold text-gray-700 flex justify-between"><span>${i.name}</span> <span class="text-amber-600">x${i.qty}</span></li>`).join('');

    let actionBtn = '';
    if (order.status === 'new') {
        actionBtn = `<button onclick="updateOrderStatus('${order.id}', 'preparing')" class="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-lg transition-all">Оғози омодакунӣ</button>`;
    } else if (order.status === 'preparing') {
        actionBtn = `<button onclick="updateOrderStatus('${order.id}', 'ready')" class="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-all">Барои бурдан ОМОДА АСТ</button>`;
    } else {
        actionBtn = `<div class="text-center text-xs text-green-600 font-bold py-1">Супорида шуд ✓</div>`;
    }

    const formatTimer = formatSeconds(order.estimatedTime * 60 - order.elapsedSeconds);

    div.innerHTML = `
        <div class="flex justify-between items-start border-b border-gray-100 pb-2">
            <div>
                <span class="bg-amber-100 text-amber-800 text-xs font-extrabold px-2 py-0.5 rounded">Миз №${order.table}</span>
                <span class="text-xs text-gray-400 ml-2">${order.id} (${order.createdAt})</span>
            </div>
            <span class="text-xs font-bold ${order.status === 'ready' ? 'text-green-600' : 'text-amber-600'}">${formatTimer}</span>
        </div>
        <ul class="space-y-1 my-2">
            ${itemsHtml}
        </ul>
        <div class="pt-2 border-t border-gray-100 flex justify-between items-center">
            <span class="font-bold text-xs text-gray-800">Ҷамъ: ${order.totalPrice} TJS</span>
        </div>
        ${actionBtn}
    `;

    return div;
}

function updateOrderStatus(id, newStatus) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
        saveOrders();
        renderKitchenBoard();
        renderGuestOrders();
    }
}

function clearCompletedOrders() {
    orders = orders.filter(o => o.status !== 'ready');
    saveOrders();
    renderKitchenBoard();
    renderGuestOrders();
}

function renderGuestOrders() {
    const container = document.getElementById('guest-orders-container');
    const wrap = document.getElementById('active-guest-orders');

    const myOrders = orders.filter(o => o.table === currentTable);

    if (myOrders.length === 0) {
        wrap.classList.add('hidden');
        return;
    }

    wrap.classList.remove('hidden');
    container.innerHTML = '';

    myOrders.forEach(order => {
        const div = document.createElement('div');
        div.className = "bg-white border border-amber-200 p-4 rounded-xl shadow-sm flex flex-col justify-between";

        let statusText = '';
        let statusBg = '';

        if (order.status === 'new') {
            statusText = 'Қабул шуд';
            statusBg = 'bg-blue-100 text-blue-700';
        } else if (order.status === 'preparing') {
            statusText = 'Дар омодашавӣ...';
            statusBg = 'bg-amber-100 text-amber-700 animate-pulse';
        } else {
            statusText = 'ОМОДА АСТ! (Офитсиант меорад)';
            statusBg = 'bg-green-100 text-green-700 font-bold';
        }

        const remainingSec = (order.estimatedTime * 60) - order.elapsedSeconds;
        const timerText = remainingSec > 0 ? formatSeconds(remainingSec) : "Ҳозир омода мешавад";

        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-gray-400">Код: ${order.id}</span>
                <span class="text-xs px-2.5 py-1 rounded-full font-bold ${statusBg}">${statusText}</span>
            </div>
            <div class="space-y-1 mb-3">
                ${order.items.map(i => `<p class="text-xs text-gray-700 flex justify-between"><span>${i.name}</span> <span>x${i.qty}</span></p>`).join('')}
            </div>
            <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span class="text-gray-500">Вақти боқимонда:</span>
                <span class="font-bold text-amber-600 text-sm">${timerText}</span>
            </div>
        `;

        container.appendChild(div);
    });
}

function updateTimers() {
    let updated = false;
    orders.forEach(o => {
        if (o.status !== 'ready') {
            o.elapsedSeconds += 1;
            updated = true;
        }
    });

    if (updated) {
        saveOrders();
        renderGuestOrders();
        if (!document.getElementById('kitchen-view').classList.contains('hidden')) {
            renderKitchenBoard();
        }
    }
}

function formatSeconds(sec) {
    if (sec <= 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log("Audio not supported");
    }
}