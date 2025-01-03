    
//nav bar responsive
      const sidebar = document.querySelector(".sidebar_col");
      const main_s = document.querySelector("#main_s");

      function toggleSidebar() {
        sidebar.classList.toggle("show");

        // Check if sidebar has the 'show' class
        if (sidebar.classList.contains("show")) {
          main_s.classList.add("overflow_hidden"); // Add custom class
        } else {
          main_s.classList.remove("overflow_hidden"); // Remove custom class
        }
      }
    
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                imagePreview.style.height = '40px';
                imagePreview.style.width = '40px';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        }
    });
