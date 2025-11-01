<script>
    import { fly } from 'svelte/transition';
    const mockProfile = {
        name: 'Tu (Admin)',
        username: 'ScarpaAdmin20',
        discordId: '1234567890',
        email: 'admin@scarpari.app',
        phone: '+393331234567',
        avatarUrl: 'https://via.placeholder.com/150/00bcd4/FFFFFF?text=A',
        favoriteTeam: 'FC Internazionale',
        registrationDate: '2025-01-10',
    };
    let isEditing = false;
</script>

<style>
    .profile-header { display: flex; align-items: center; gap: 25px; margin-bottom: 30px; }
    .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-color-glow); box-shadow: 0 0 10px var(--accent-color); }
    .profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .detail-item { padding: 10px; border-bottom: 1px dashed #4a4a75; }
    .detail-item strong { display: block; color: var(--accent-color); font-size: 0.8em; margin-bottom: 5px; }
    .detail-item span { color: var(--text-color); }
    
    /* Mobile: Stack items */
    @media (max-width: 600px) {
        .profile-details { grid-template-columns: 1fr; }
    }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Il Mio Profilo 👤</h1>

<div class="panel" transition:fly={{ y: 50, duration: 500 }}>
    <div class="profile-header">
        <img src={mockProfile.avatarUrl} alt="Avatar" class="avatar" />
        <div>
            <h2>{mockProfile.name}</h2>
            <p style="color: #aaa;">@{mockProfile.username}</p>
        </div>
        <button class="btn-success" style="margin-left: auto;" on:click={() => isEditing = !isEditing}>
            {isEditing ? 'Salva Modifiche' : 'Modifica Profilo'}
        </button>
    </div>

    <div class="profile-details">
        <div class="detail-item"><strong>Email</strong> <span>{mockProfile.email}</span></div>
        <div class="detail-item"><strong>Discord ID</strong> <span>{mockProfile.discordId}</span></div>
        <div class="detail-item"><strong>Telefono</strong> <span>{mockProfile.phone}</span></div>
        <div class="detail-item"><strong>Squadra Preferita</strong> <span>{mockProfile.favoriteTeam}</span></div>
        <div class="detail-item"><strong>Data Registrazione</strong> <span>{mockProfile.registrationDate}</span></div>
        </div>
</div>
