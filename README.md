# 🍽️ WiseBites – Plataforma de Nutrição Inteligente

**Disciplina:** Programação para Internet 1  
**Curso:** Análise e Desenvolvimento de Sistemas – IFPI – Campus Piripiri  
**Professor:** Prof. Maykol  

---

## 📖 Sobre o Projeto

O **WiseBites** nasceu durante a disciplina de Engenharia de Software II como um projeto acadêmico com o objetivo de criar uma plataforma digital que auxiliasse **nutricionistas** e **pacientes** na gestão de planos alimentares, acompanhamento de refeições e análise nutricional. Além da motivação acadêmica, buscamos unir **tecnologia**, **design responsivo**.

---

## 👨‍💻 Integrantes da Equipe

- **Larissa Souza do Nascimento**  
- **Luís Guilherme Sampaio Fontenele**  
- **Maria Isabelly de Brito Rodrigues**  
- **Júlio César Cerqueira Pires**

---

## 🚀 Funcionalidades Implementadas

### 1. **Carrossel de Imagens e Depoimentos** (`carousel.js`)
- Início automático com intervalo de 5 segundos.
- Botões "Anterior" e "Próximo" para navegação manual.
- Pausa automática quando o mouse está sobre o carrossel.
- Reinício do temporizador após interação.

### 2. **Filtragem de Projetos** (`filter.js`)
- Botões de categorias para filtrar conteúdo (ex.: React, PHP, etc.).
- Opção "Todos" para exibir todos os projetos.
- Ocultação dinâmica dos elementos que não correspondem ao filtro.

### 3. **Pesquisa Global no Site** (`search.js`)
- Campo de busca no menu principal.
- Busca assíncrona utilizando `fetch()` e `DOMParser`.
- Exibição de resultados com contexto e link direto para a página.

### 4. **Sistema de Login** (`login.js` e `script.js`)
- Modal de login com validação de usuário e senha.
- Substituição do botão "Login" por informações do perfil quando autenticado.
- Botão de logout funcional.

### 5. **Validação de Formulários**
- **Login:** validação de formato da senha (mínimo 8 caracteres, números, caracteres especiais, maiúsculas e minúsculas).
- **Contato:** validação de nome, e-mail, assunto e mensagem, com contador de caracteres.

### 6. **Efeitos e Animações** (`ui-enhancements.js`)
- **Botão "Voltar ao Topo"** com animação suave.
- **Botão "Copiar"** para copiar textos ou códigos com feedback visual.
- **Alternador de Tema** (Claro/Escuro) com persistência via `localStorage`.

---

## 🎯 Requisitos Não-Funcionais
- Layout totalmente responsivo (Flexbox e Grid).
- Menu hamburguer para telas menores.
- Código JavaScript limpo, comentado e organizado.
- HTML e CSS seguindo boas práticas semânticas.

---

## 🛠️ Tecnologias Utilizadas
- **HTML5** – Estrutura semântica
- **CSS3 / Tailwind CSS** – Estilização e responsividade
- **JavaScript (ES6)** – Funcionalidades dinâmicas
- **LocalStorage** – Persistência de tema e estado de login

