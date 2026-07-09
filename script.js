 // --------------------------------------------------------------
        // 1. DOM References
        // --------------------------------------------------------------
        const grid = document.getElementById('productGrid');
        const loader = document.getElementById('loader');
        const noResults = document.getElementById('noResults');
        const countEl = document.getElementById('count');
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        // --------------------------------------------------------------
        // 2. State
        // --------------------------------------------------------------
        let allProducts = [];
        let filteredProducts = [];

        // --------------------------------------------------------------
        // 3. Fetch Products from API
        // --------------------------------------------------------------
        async function fetchProducts() {
            try {
                loader.style.display = 'flex';
                grid.innerHTML = '';
                noResults.style.display = 'none';

                const res = await fetch('https://dummyjson.com/products');
                if (!res.ok) throw new Error('Failed to fetch products');

                const data = await res.json();
                allProducts = data.products;
                filteredProducts = [...allProducts];
                renderProducts(filteredProducts);
            } catch (error) {
                grid.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:#ef4444;">
                        <strong>⚠️ Something went wrong</strong><br />
                        ${error.message}
                    </div>
                `;
            } finally {
                loader.style.display = 'none';
            }
        }

        // --------------------------------------------------------------
        // 4. Render Products
        // --------------------------------------------------------------
        function renderProducts(products) {
            // Update count
            countEl.textContent = products.length;

            // Hide/show no-results
            if (products.length === 0) {
                grid.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }
            noResults.style.display = 'none';

            // Build cards
            let html = '';
            products.forEach(p => {
                const discounted = p.price - (p.price * p.discountPercentage / 100);
                const rating = p.rating || 0;

                html += `
                    <div class="product-card">
                        <div class="image-wrap">
                            <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2212%22 fill=%22%2394a3b8%22%3ENo Image%3C/text%3E%3C/svg%3E'" />
                        </div>
                        <div class="info">
                            <div class="category">${p.category}</div>
                            <div class="title" title="${p.title}">${p.title}</div>
                            <div class="desc">${p.description || ''}</div>
                            <div class="bottom">
                                <div class="price">
                                    $${discounted.toFixed(2)}
                                    <small>$${p.price.toFixed(2)}</small>
                                </div>
                                <div class="rating">
                                    ⭐ ${rating.toFixed(1)} <span>(${p.reviews?.length || 0})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            grid.innerHTML = html;
        }

        // --------------------------------------------------------------
        // 5. Filter Logic (Search + Category)
        // --------------------------------------------------------------
        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const category = categoryFilter.value;

            filteredProducts = allProducts.filter(p => {
                const matchSearch = p.title.toLowerCase().includes(searchTerm) ||
                                    p.description?.toLowerCase().includes(searchTerm) ||
                                    p.category.toLowerCase().includes(searchTerm);
                const matchCategory = category === '' || p.category === category;
                return matchSearch && matchCategory;
            });

            renderProducts(filteredProducts);
        }

        // --------------------------------------------------------------
        // 6. Event Listeners
        // --------------------------------------------------------------
        searchInput.addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);

        // --------------------------------------------------------------
        // 7. Start
        // --------------------------------------------------------------
        fetchProducts();