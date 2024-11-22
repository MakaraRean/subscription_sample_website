window.onload = function() {
    const url = 'http://192.168.197.18:22050/1.0/kb/catalog';

    // // Optional: Add query parameters
    // const queryParams = new URLSearchParams({
    // requestedDate: 'current date',
    // accountId: 'your_account_id' // Replace with your actual account ID
    // });
    // const fullUrl = `${url}?${queryParams.toString()}`;
    const headers = new Headers();
    headers.append('X-Killbill-ApiKey', 'admin');
    headers.append('X-Killbill-ApiSecret', 'password');
    headers.append("authorization", "Basic YWRtaW46cGFzc3dvcmQ=");

    fetch(url, {headers: headers})
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 1  // Process the received catalog data
        createPlanItem(data)
    })
    .catch(error => {
        console.error('Error fetching catalog:', error);
    });

};

// Function to create the subscription element
function createPlanItem(productsData) {
    productsData.sort((a, b) => {
        const priceA = a.products[0].plans[0].phases[0].prices[0].value;
        const priceB = b.products[0].plans[0].phases[0].prices[0].value;
        return priceA - priceB;
      });
    const productContainer = document.getElementById('planItem__container'); // Replace with your actual container ID
    
    productsData.forEach(product => {
      product.products.forEach(productDetail => {
        const planItem = document.createElement('div');
        planItem.classList.add('planItem', 'planItem--free');
    
        const planName = productDetail.prettyName;
        const evergreenPhase = productDetail.plans[0].phases.find(phase => phase.type === 'EVERGREEN');
        const planPrice = evergreenPhase.prices[0].value;
        const features = productDetail.available;
    
        planItem.innerHTML = `
          <div class="card">
            <div class="card__header">
              <div class="card__icon symbol symbol--rounded"></div>
              <h2>${planName}</h2>
            </div>
            <div class="card__desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do</div>
    
            <div class="price">$${planPrice}<span>/ month</span></div>
    
            <ul class="featureList">
              ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
    
            <form action="/create-checkout-session" method="POST">
              <input type="hidden" name="lookup_key" value="${productDetail.plans[0].name}" />
              <button class="button" id="checkout-and-portal-button" type="submit">Subscribe</button>
            </form>
          </div>
        `;
    
        productContainer.appendChild(planItem);
      });
    });
}

// Assuming you have a div with the class 'dev'
const devDiv = document.querySelector('.dev');

// Create the plan item and append it to the 'dev' div
const planItemElement = createPlanItem(responseData);
devDiv.appendChild(planItemElement);