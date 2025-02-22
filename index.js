const fetchApi = async (value) => {
   const resposta = await fetch (`https://api.github.com/users/${value}`)
   const dados = await resposta.json()
   return dados;
}

const fetchApiRepositorios = async (value) => {
    const resposta = await fetch (`https://api.github.com/users/${value}/repos`)
    const dados = await resposta.json()
    return dados;
}

const fetchApiEventos = async (value) => {
    const resposta = await fetch (`https://api.github.com/users/${value}/events`)
    const dados = await resposta.json()
    return dados;
    
 }


let input = document.getElementById('input');
let btn = document.getElementById('btn-input');
let nome = document.getElementById('nomeUsuario');
let login = document.getElementById('loginUsuario');
let bio = document.getElementById('bioUsuario');
let follow = document.getElementById('followUsuario');
let followers = document.getElementById('followersUsuario');
let foto = document.getElementById('fotoUsuario');
let reposInfo = document.getElementById('repositoriosUsuario');
let eventosCreate = document.getElementById('eventosUsuarioCreate');
let eventosPush = document.getElementById('eventosUsuarioPush');

const atualizar = async (usuario) => {
    const usuarioData = await fetchApi(usuario);
    nome.innerHTML = `<h3>${usuarioData.name ?? "Usuário não tem um nome cadastrado :("}</h3>`;
    bio.innerHTML = `<h4>${usuarioData.bio ?? "Usuário não tem uma bio cadastrada :("}</h4>`;
    foto.src = usuarioData.avatar_url;
    login.innerHTML = `<h4>${usuarioData.login}</h4>`;
follow.innerHTML = `<h4>🫂 Following: ${usuarioData.following} usuários</h4>`;
followers.innerHTML = `<h4>👤 Followers: ${usuarioData.followers} seguidores</h4>`;

const repositoriosData = await fetchApiRepositorios(usuario);
    reposInfo.textContent = repositoriosData.length > 0 
    ? repositoriosData.slice(0, 10).map(repo => repo.name).join(', ') 
    : "Sem repositórios";

    let reposHtml = "";

    repositoriosData.slice(0, 10).forEach((repo) => {
        reposHtml += 
            
`<h4> Repositório:&nbsp;</h4>  
<p> ${repo.name}  </p>
<a href=" ${repo.html_url}" target="_blank">&nbsp;<u>🔗Acessar</u></a>
<ul>
<li>
    🍴&nbsp;Forks:&nbsp;${repo.forks_count} 
| ⭐&nbsp;Stars:&nbsp;${repo.stargazers_count} 
| 👀&nbsp;Watchers:&nbsp;${repo.watchers_count} 
| 🏷️&nbsp;Linguagem:&nbsp;${repo.language ?? 'Não especificada'}
</ul>
</li>`;
    });

    
    reposInfo.innerHTML = reposHtml;

const usuarioEventos = await fetchApiEventos(usuario);
    
    eventosCreate.textContent = "";
    eventosPush.textContent = "";

usuarioEventos.slice(0, 10).forEach((evento) => {

    if (evento.type === 'CreateEvent') {
        eventosCreate.innerHTML += `<h3>Sem mensagem de commit!</h3>`;
    } else { 
        if (evento.type === 'PushEvent')  {
            
            evento.payload.commits.forEach(commit => {
            
            eventosPush.innerHTML += `<h3>Eventos:</h3>
            <p>-${evento.repo.name}- ${commit.message}</p>`;
            });
        }
    }
});

}

    btn.addEventListener('click', (event) => {
        event.preventDefault();
        const usuario = input.value;  
        atualizar(usuario); 
    });


    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') { 
            const usuario = input.value;
            atualizar(usuario);
        }
    });