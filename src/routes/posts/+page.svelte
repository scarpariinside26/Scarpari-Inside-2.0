<script>
    import { fly } from 'svelte/transition';
    // Dati simulati per i post
    let mockPosts = [
        { id: 101, author: 'Admin Scarpa', content: 'Aggiornamento Bot 2.0: Nuove API per i voti live. Test in corso.', likes: 15, comments: 3, timestamp: '1 ora fa' },
        { id: 102, author: 'Giocatore X', content: 'Sono pronto per il torneo di stasera! Chi si unisce?', likes: 20, comments: 5, timestamp: '2 ore fa' },
    ];
    let newPostContent = '';

    function toggleLike(post) {
        post.likes += post.isLiked ? -1 : 1;
        post.isLiked = !post.isLiked;
        mockPosts = mockPosts; // Forza l'aggiornamento
    }
    function addPost() {
        if (newPostContent.trim()) {
            mockPosts.unshift({ 
                id: Date.now(), 
                author: 'Tu (Admin)', 
                content: newPostContent, 
                likes: 0, 
                comments: 0, 
                timestamp: 'Adesso',
                isLiked: false 
            });
            newPostContent = '';
        }
    }
</script>

<style>
    .post-input { margin-bottom: 30px; }
    textarea { width: 100%; min-height: 100px; background: #333650; color: var(--text-color); border: 1px solid #4a4a75; padding: 10px; border-radius: 6px; }
    .post-card { margin-bottom: 20px; }
    .post-meta { display: flex; justify-content: space-between; font-size: 0.8em; color: #aaa; margin-bottom: 10px; }
    .post-content { margin-bottom: 15px; }
    .post-actions button { background: none; border: none; color: var(--accent-color-glow); cursor: pointer; margin-right: 15px; }
    .like-icon { color: var(--danger-color); }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Notizie & Post 📰</h1>

<div class="panel post-input" transition:fly={{ y: -20, duration: 500 }}>
    <h3>Crea Nuovo Post</h3>
    <textarea placeholder="Cosa c'è di nuovo?" bind:value={newPostContent}></textarea>
    <button class="btn-success" on:click={addPost}>Pubblica</button>
</div>

{#each mockPosts as post (post.id)}
    <div class="panel post-card" transition:fly={{ y: 20, duration: 500 }}>
        <div class="post-meta">
            <strong>{post.author}</strong>
            <span>{post.timestamp}</span>
        </div>
        <p class="post-content">{post.content}</p>
        <div class="post-actions">
            <button on:click={() => toggleLike(post)}>
                <span class:like-icon={post.isLiked}>👍</span> {post.likes} Like
            </button>
            <button>
                💬 {post.comments} Commenti
            </button>
        </div>
    </div>
{/each}
