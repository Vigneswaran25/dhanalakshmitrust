/* --- Visitor Form Logic --- */
function initForm() {
    const form = document.getElementById('visitor-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        const formData = new FormData(form);

        // UI Loading State
        btn.innerHTML = 'Sending...';
        btn.style.opacity = '0.7';

        fetch("https://formsubmit.co/ajax/mickyy2510@gmail.com", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Success UI
                form.reset();
                btn.innerHTML = 'Message Sent!';
                btn.style.background = '#22c55e';
                btn.style.color = 'white';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);

                alert(`Thank you! We have received your request. Check your email for confirmation.`);
            })
            .catch(error => {
                console.error('Error:', error);
                btn.innerHTML = 'Error! Try Again';
                btn.style.background = '#ef4444'; // Red error
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            });
    });
}

/* --- Gallery Logic (LocalStorage - Static Friendly) --- */
function initGallery() {
    const fileInput = document.getElementById('local-upload');
    const grid = document.getElementById('gallery-grid');
    const deleteBtn = document.getElementById('delete-selected');

    if (!fileInput || !grid) return;

    // 1. Load Saved Images
    loadSavedImages();

    // 2. Click to Select Logic
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

    // 3. Delete Selected One-by-One
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const selected = grid.querySelectorAll('.gallery-item.selected');
            if (confirm(`Remove ${selected.length} items?`)) {
                selected.forEach(item => {
                    // Try to identify if it's a persisted image to remove from storage
                    const img = item.querySelector('img');
                    if (img && img.src.startsWith('data:')) {
                        removeImageFromStorage(img.src);
                    }
                    item.remove();
                });
                updateDeleteButton();
            }
        });
    }

    // 4. Handle New Uploads
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            try {
                saveImageToStorage(imageData);
                renderImage(imageData, 'Just Now: Uploaded from Device', true);
            } catch (err) {
                alert("Storage Full! Please remove some images.");
            }
        }
        reader.readAsDataURL(file);
        fileInput.value = '';
    });

    // Helper: Render Image
    function renderImage(src, caption, isNew = false) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${src}" alt="Event Photo">
            <div class="gallery-caption">${caption}</div>
        `;
        if (isNew) div.style.animation = 'fadeIn 0.5s ease-out';

        // Prepend to show new first
        grid.prepend(div);
    }

    // Storage Helpers
    function saveImageToStorage(base64Str) {
        let images = JSON.parse(localStorage.getItem('trust_gallery_images') || '[]');
        images.push({ src: base64Str, date: new Date().toLocaleDateString() });
        localStorage.setItem('trust_gallery_images', JSON.stringify(images));
    }

    function removeImageFromStorage(srcToRemove) {
        let images = JSON.parse(localStorage.getItem('trust_gallery_images') || '[]');
        images = images.filter(img => img.src !== srcToRemove);
        localStorage.setItem('trust_gallery_images', JSON.stringify(images));
    }

    function loadSavedImages() {
        const images = JSON.parse(localStorage.getItem('trust_gallery_images') || '[]');
        images.forEach(img => renderImage(img.src, `Uploaded: ${img.date}`));
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
