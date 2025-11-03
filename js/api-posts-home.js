const postsContainer = document.getElementById("posts-container");

async function loadPosts() {
  try {
    const response = await fetch("https://api.irmaidelfranca.org/wp-json/wp/v2/posts?per_page=3&_embed");
    const posts = await response.json();

    postsContainer.innerHTML = posts.map(post => {
      const image = post._embedded["wp:featuredmedia"]
        ? post._embedded["wp:featuredmedia"][0].source_url
        : "https://via.placeholder.com/600x400?text=Sem+Imagem";

      const date = new Date(post.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      return `
        <a href="post.html?id=${post.id}" class="post-card">
          <img src="${image}" alt="${post.title.rendered}">
          <div class="post-content">
            <h3>${post.title.rendered}</h3>
            <p>${post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120)}...</p>
            <div class="post-meta">
              <span><span class="material-symbols-outlined">calendar_month</span> ${date}</span>
              <span><span class="material-symbols-outlined">checkbook</span> Instituto Hand Maria</span>
            </div>
          </div>
          <div class="post-footer">
            <span>
              Ver detalhes<span class="material-symbols-outlined setinha">arrow_forward</span>
            </span>
          </div>
        </a>
      `;
    }).join("");

  } catch (error) {
    postsContainer.innerHTML = "<p>Erro ao carregar os posts.</p>";
    console.error(error);
  }
}

loadPosts();
