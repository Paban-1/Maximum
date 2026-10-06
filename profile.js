
const ProfileModule = {
    saveProfile: function(e) {
        e.preventDefault();
        const name = document.getElementById('profile-name-input').value.trim();
        const urlInput = document.getElementById('profile-pic-url').value.trim();
        if (name) appState.user.name = name;
        if (urlInput) appState.user.avatar = urlInput;
        saveAppData();
        showToast("Profile updated successfully!");
        router.navigate('dashboard');
    },

    handleImageUpload: function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                appState.user.avatar = event.target.result;
                document.getElementById('profile-preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    updateUI: function() {
        document.getElementById('dash-name').textContent = appState.user.name;
        document.getElementById('dash-avatar').src = appState.user.avatar;
        document.getElementById('profile-name-input').value = appState.user.name;
        document.getElementById('profile-pic-url').value = appState.user.avatar.startsWith('data:') ? '' : appState.user.avatar;
        document.getElementById('profile-preview').src = appState.user.avatar;
    }
};


