/* --- Gallery Logic (PHP Backend) --- */
function initGallery() {
    const fileInput = document.getElementById('local-upload');
    const grid = document.getElementById('gallery-grid');
    const deleteBtn = document.getElementById('delete-selected');
    const wrapper = document.querySelector('.gallery-wrapper');

    if (!fileInput || !grid) return;

    // 0. Load Images from Server
    fetchImages();

    // 1. Click to Select Logic
    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            item.classList.toggle('selected');
            updateDeleteButton();
        }
    });

    function updateDeleteButton() {
        const selected = grid.querySelectorAll('.gallery-item.selected');
        if (deleteBtn) {
            deleteBtn.style.display = selected.length > 0 ? 'inline-block' : 'none';
            deleteBtn.innerHTML = `<ion-icon name="trash-outline" style="vertical-align:middle;"></ion-icon> Remove (${selected.length})`;
        }
    }

    // 2. Delete Selected (Server API)
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const selected = grid.querySelectorAll('.gallery-item.selected');
            if (confirm(`Remove ${selected.length} items from server?`)) {
                selected.forEach(async item => {
                    const id = item.dataset.id;
                    if (id) {
                        // Delete from Server
                        await fetch('api/gallery.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id })
                        });
                    }
                    item.remove();
                });
                updateDeleteButton();
            }
        });
    }

    // 3. Handle Uploads (Server API)
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function (e) {
            const imageData = e.target.result;

            // Upload to Server
            try {
                const response = await fetch('api/gallery.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageData })
                });
                const result = await response.json();

                if (result.status === 'success') {
                    renderImage(imageData, 'Just Now: Uploaded', result.id, true);
                } else {
                    alert('Upload failed: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        reader.readAsDataURL(file);
        fileInput.value = '';
    });

    // Fetch Helper
    async function fetchImages() {
        try {
            const res = await fetch('api/gallery.php');
            const images = await res.json();
            images.forEach(img => {
                renderImage(img.image_data, `Uploaded: ${new Date(img.created_at).toLocaleDateString()}`, img.id);
            });
        } catch (e) {
            console.log("Backend not reachable or empty. Showing only defaults.");
        }
    }

    // Render Helper
    function renderImage(src, caption, id = null, isNew = false) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        if (id) div.dataset.id = id; // Store ID for deletion

        div.innerHTML = `
            <img src="${src}" alt="Event Photo">
            <div class="gallery-caption">${caption}</div>
        `;
        if (isNew) div.style.animation = 'fadeIn 0.5s ease-out';
        grid.prepend(div);
    }
}

/* --- Carousel Navigation --- */
window.scrollGallery = function (direction) {
    const grid = document.getElementById('gallery-grid');
    const scrollAmount = 320;
    if (grid) {
        grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

/* --- Form Logic (Preserved) --- */
function initForm() {
    const form = document.getElementById('visitor-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Keep existing logic
            e.preventDefault();
            // ... (Simple Alert for demo)
            alert("Message Sent (Simulated)");
            form.reset();
        });
    }
}

/* --- Smooth Scroll (Lenis) --- */
function initSmoothScroll() {
    try {
        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    } catch (e) { }
}

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    initGallery();
    initSmoothScroll();
});
