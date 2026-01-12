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

/* --- Gallery Logic (Grid + Lightbox) --- */
function initGallery() {
    const grid = document.getElementById('gallery-grid');
    const fileInput = document.getElementById('local-upload');
    const deleteBtn = document.getElementById('delete-selected');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.lightbox-close');

    if (!grid) return;

    // Initial Load
    renderGallery();

    // 1. Render Gallery (Upload Card + Saved Images)
    function renderGallery() {
        grid.innerHTML = ''; // Clear current

        // A. Add "Upload New" Card
        const uploadCard = document.createElement('div');
        uploadCard.className = 'gallery-item upload-card';
        uploadCard.onclick = () => fileInput.click();
        uploadCard.innerHTML = `
            <div class="upload-icon"><ion-icon name="add-circle-outline"></ion-icon></div>
            <div class="upload-text">Share Your Moment</div>
        `;
        grid.appendChild(uploadCard);

        // B. Add Static/Initial Images (If no local storage exists yet, or always?)
        // Let's just use local storage as the source of truth + some hardcoded defaults if empty
        let images = getSavedImages();

        if (images.length === 0) {
            // Seed defaults for demo
            images = [
                { src: 'assets/food.png', caption: 'Food Drive in Chennai', type: 'static' },
                { src: 'assets/education.png', caption: 'School Kit Distribution', type: 'static' }
            ];
        }

        images.forEach((img, index) => {
            const card = createGalleryItem(img, index);
            grid.appendChild(card);
        });

        updateDeleteButton();
    }

    function createGalleryItem(imgObj, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.index = index; // For selection/deletion

        // Image
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = "Impact Photo";

        // Caption
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = imgObj.caption || 'Community Impact';

        div.appendChild(img);
        div.appendChild(caption);

        // Click Handler (View vs Select)
        div.onclick = (e) => {
            // If in "Delete Mode" (toggle selection) - for now let's say long press or specific trigger? 
            // Simplified: Click opens Lightbox. 
            // To delete, we might need a UI toggle?
            // Let's stick to the previous requirement: "Click to select" mixed with lightbox is tricky.
            // Let's add a small "select" circle or make the lightbox open only on the image, and selection on border?
            // Actually, let's keep it simple: Click Opens Lightbox. 
            // But user wanted "Select/Remove".
            // Compromise: Add a small "checkbox" or specific area to select?
            // Or: Lightbox has a "Delete" button?
            // Let's go with: Click main area = Lightbox. 
            // We need a specific way to select for deletion or just abandon bulk delete for simplicity?
            // The prompt "Select/Remove individual images" was a requirement.
            // Let's use a Long Press or Alt Click? No, too hidden.
            // Let's add a 'Select' mode?
            // Or simpler: Click = Lightbox. Lightbox has "Delete" option if it's a user upload.

            // Wait, previous logic was "Click to Select".
            // Let's change behavior:
            // Normal Click -> Open Lightbox
            // Click with Shift/Ctrl or Long Press -> Select? 
            // Better: Add a "Select" button overlay on hover?

            // Let's stick to: Click = Lightbox.
            // But we need to support the deletion requirement.
            // Let's add a faint "Trash" icon on hover for user-uploaded images?
            // Or enable a "Manage Mode" toggle?

            // For now, let's stick to: Click opens Lightbox.
            // Inside lightbox, if it's a local image, show a Delete button.
            // AND: To support "Remove Selected" from the main view, let's add a "Select" toggle on the card corner.

            // Refined: Click on image -> Lightbox.
            // We will add a small checkbox overlay for selection.
            openLightbox(imgObj.src, imgObj.caption);
        };

        // Add a selection overlay (stopPropagation)
        // Or just revert: Click = Select (for Management) is conflicting with Lightbox.
        // Let's make the caption area clickable for Lightbox, and the image clickable for selection? 
        // No, that's confusing.

        // Let's implement: Click = Lightbox.
        // But add a separate "Manage Gallery" button to toggle selection mode?
        // Let's keep it simple. Long click or just a small "Select" checkbox that appears on hover.

        const selectBtn = document.createElement('div');
        selectBtn.className = 'select-overlay';
        selectBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>';
        selectBtn.style.cssText = `
            position: absolute; top: 10px; right: 10px; font-size: 24px; color: white; display: none; z-index: 5;
            background: rgba(0,0,0,0.3); border-radius: 50%;
        `;
        // Show on hover
        div.onmouseenter = () => selectBtn.style.display = 'block';
        div.onmouseleave = () => {
            if (!div.classList.contains('selected')) selectBtn.style.display = 'none';
        };

        selectBtn.onclick = (e) => {
            e.stopPropagation();
            div.classList.toggle('selected');
            if (div.classList.contains('selected')) {
                selectBtn.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon>';
                selectBtn.style.color = '#ef4444';
                selectBtn.style.display = 'block'; // Keep it shown
            } else {
                selectBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>';
                selectBtn.style.color = 'white';
            }
            updateDeleteButton();
        };

        div.appendChild(selectBtn);

        return div;
    }

    // 2. Upload Logic
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            try {
                saveImageToStorage(imageData);
                renderGallery(); // Re-render to show new order
            } catch (err) {
                alert("Storage Full! Please remove some images.");
            }
        }
        reader.readAsDataURL(file);
        fileInput.value = '';
    });

    // 3. Delete Logic
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const selected = grid.querySelectorAll('.gallery-item.selected');
            if (confirm(`Remove ${selected.length} items?`)) {
                // Get indices or srcs to remove
                // Easier: iterate DOM, find selected, remove from Storage matching src
                selected.forEach(card => {
                    const img = card.querySelector('img');
                    removeImageFromStorage(img.src);
                });
                renderGallery(); // Refresh
                updateDeleteButton();
            }
        });
    }

    function updateDeleteButton() {
        const selected = grid.querySelectorAll('.gallery-item.selected');
        if (deleteBtn) {
            deleteBtn.style.display = selected.length > 0 ? 'inline-block' : 'none';
            deleteBtn.innerHTML = `<ion-icon name="trash-outline" style="vertical-align:middle;"></ion-icon> Remove (${selected.length})`;
        }
    }

    // Storage Helpers
    function getSavedImages() {
        return JSON.parse(localStorage.getItem('trust_gallery_images') || '[]');
    }

    function saveImageToStorage(base64Str) {
        let images = getSavedImages();
        images.unshift({ src: base64Str, date: new Date().toLocaleDateString(), caption: 'Just Now' }); // Add to top
        localStorage.setItem('trust_gallery_images', JSON.stringify(images));
    }

    function removeImageFromStorage(srcToRemove) {
        let images = getSavedImages();
        images = images.filter(img => img.src !== srcToRemove);
        localStorage.setItem('trust_gallery_images', JSON.stringify(images));
    }

    // Lightbox Functions
    function openLightbox(src, caption) {
        lightbox.style.display = 'flex';
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
    }

    if (closeLightbox) {
        closeLightbox.onclick = () => lightbox.style.display = 'none';
        lightbox.onclick = (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        }
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
