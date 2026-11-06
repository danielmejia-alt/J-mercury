const PRODUCTS={
 "dije-millonario":{name:"Pulsera Dije Millonario",price:50000,image:"assets/pulsera-dije-millonario.jpg"},
 "medalla-virgen":{name:"Pulsera Medalla Virgen",price:35000,image:"assets/pulsera-medalla-virgen.jpg"},
 "oro-facetado":{name:"Pulsera Oro Facetado",price:35000,image:"assets/pulsera-oro-facetado.jpg"},
 "oro-mixto":{name:"Pulsera Oro Mixto",price:35000,image:"assets/pulsera-oro-mixto.jpg"},
 "set-duo-oro":{name:"Set Dúo Oro Facetado",price:90000,image:"assets/set-duo-oro.jpg"},
 "set-duo-nudos":{name:"Set Dúo Nudos Dorados",price:20000,image:"assets/set-duo-nudos.jpg"},
 "nudos-negra":{name:"Manilla Nudos Negra",price:25000,image:"assets/manilla-nudos-negra.jpg"},
 "hilo-rojo":{name:"Manilla Hilo Rojo",price:25000,image:"assets/manilla-hilo-rojo.jpg"},
 "anillo-racimo":{name:"Anillo Racimo",price:25000,image:"assets/anillos.jpg"},
 "anillo-rose":{name:"Anillo Rosé",price:20000,image:"assets/anillos.jpg"},
 "anillo-rojo":{name:"Anillo Hilo Rojo",price:15000,image:"assets/anillos.jpg"},
 "anillo-lazo":{name:"Anillo Lazo",price:20000,image:"assets/anillos.jpg"},
 "anillo-mosaico":{name:"Anillo Mosaico",price:25000,image:"assets/anillos.jpg"}
};
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
const getCart=()=>JSON.parse(localStorage.getItem("jm_cart")||"{}");
const saveCart=cart=>{localStorage.setItem("jm_cart",JSON.stringify(cart));updateCartCount();};
function updateCartCount(){const cart=getCart();const count=Object.values(cart).reduce((a,b)=>a+b,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);}
function renderCart(){
 const target=document.getElementById("cartItems");if(!target)return;
 const cart=getCart();const entries=Object.entries(cart).filter(([id,q])=>PRODUCTS[id]&&q>0);
 if(!entries.length){target.innerHTML='<p class="empty-cart">Tu carrito está vacío. Explora la colección y encuentra tu próxima pieza.</p>';}
 else target.innerHTML=entries.map(([id,q])=>{const p=PRODUCTS[id];return `<article class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="cart-controls"><button data-cart-action="minus" data-id="${id}">−</button><span>${q}</span><button data-cart-action="plus" data-id="${id}">+</button></div></div><button class="remove-item" data-cart-action="remove" data-id="${id}">Eliminar</button></article>`}).join("");
 const total=entries.reduce((sum,[id,q])=>sum+PRODUCTS[id].price*q,0);const subtotal=document.getElementById("cartSubtotal");if(subtotal)subtotal.textContent=money(total);
}
document.addEventListener("DOMContentLoaded",()=>{
 const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
 updateCartCount();renderCart();
 const rv=document.querySelectorAll(".reveal");if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target);}}),{threshold:.08});rv.forEach(el=>io.observe(el));}else rv.forEach(el=>el.classList.add("visible"));
 const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
 if(toggle&&nav)toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"×":"☰";});
 document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".product-card").forEach(card=>card.hidden=btn.dataset.filter!=="all"&&card.dataset.category!==btn.dataset.filter);}));
 document.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{const cart=getCart();cart[btn.dataset.id]=(cart[btn.dataset.id]||0)+1;saveCart(cart);const old=btn.textContent;btn.textContent="✓ Agregado";setTimeout(()=>btn.textContent=old,1000);}));
 document.addEventListener("click",e=>{const b=e.target.closest("[data-cart-action]");if(!b)return;const cart=getCart(),id=b.dataset.id,action=b.dataset.cartAction;if(action==="remove"||action==="minus"&&cart[id]<=1)delete cart[id];else if(action==="minus")cart[id]--;else if(action==="plus")cart[id]++;saveCart(cart);renderCart();});
 document.querySelectorAll(".favorite").forEach(btn=>btn.addEventListener("click",()=>{btn.classList.toggle("liked");btn.textContent=btn.classList.contains("liked")?"♥":"♡";}));
 const checkout=document.getElementById("checkoutBtn");if(checkout)checkout.addEventListener("click",()=>{const cart=getCart();if(!Object.keys(cart).length){alert("Tu carrito está vacío.");return;}const lines=Object.entries(cart).map(([id,q])=>`${PRODUCTS[id].name} x${q} — ${money(PRODUCTS[id].price*q)}`);const total=Object.entries(cart).reduce((s,[id,q])=>s+PRODUCTS[id].price*q,0);const msg=`Hola J-Mercury, quiero realizar este pedido:\n${lines.join("\n")}\nTotal productos: ${money(total)}\nPor favor confirmen disponibilidad y envío.`;const url="https://wa.me/?text="+encodeURIComponent(msg);window.open(url,"_blank");});
 const form=document.getElementById("contactForm");if(form)form.addEventListener("submit",e=>{e.preventDefault();const f=document.getElementById("formFeedback");if(f)f.textContent="Gracias por tu mensaje. Conecta el formulario a un servicio de envío para recibir consultas.";form.reset();});
});