const rodapeSite = `
        <div class="rodape">
            <div class="rodape-container">

                <!-- Coluna 1: Logo / descrição -->
                <div class="rodape-coluna">
                    <img src="assets/logos/logo-idelfranca.svg" alt="Instituto Hand Maria" class="rodape-logo">
                    <p>
                        A Associação Irmã Idelfranca transforma vidas com ações de cuidado e inclusão, fortalecendo laços e contando com o apoio de quem acredita em um futuro mais humano.
                    </p>
                </div>

                <!-- Coluna 2: Links úteis -->
                <div class="rodape-coluna">
                    <h3>Links Rápidos</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="inscricoes.html">Inscrições</a></li>
                        <li><a href="noticias.html">Noticias</a></li>
                        <li><a href="sobre-nos.html">Sobre nós</a></li>
                        <li><a href="transparencia.html">Transparência</a></li>
                        <li><a href="doe.html">Doações</a></li>
                        <li><a href="impacto.html">Nosso impacto</a></li>
                        <li><a href="quero-apoiar.html">Quero apoiar</a></li>
                        <li><a href="politica-privacidade.html">Política de Privacidade</a></li>
                        <li><a href="termos-uso.html">Termos de Uso</a></li>
                    </ul>
                </div>

                <!-- Coluna 3: Contatos -->
                <div class="rodape-coluna">
                    <h3>Contato</h3>
                    <p><strong>Telefone:</strong> <a href="tel:+5511940770336" target="_blank">(11) 94077-0336</a></p>
                    <p><strong>Telefone:</strong> <a href="tel:+5511954599252" target="_blank">(11) 95459-9252</a></p>
                    <p><strong>E-mail:</strong> <a
                            href="mailto:contato@irmaidelfranca.org">contato@irmaidelfranca.org</a></p>
                    <p><strong>E-mail:</strong> <a
                            href="mailto:coordenacaoidelfranca@gmail.com">coordenacaoidelfranca@gmail.com</a></p>
                    <p><strong>Endereço:</strong> R. Edalberto dos Santos, 313 - Vila Piracicaba - São Paulo/SP</p>
                </div>

                <!-- Coluna 4: Redes sociais -->
                <div class="rodape-coluna">
                    <h3>Siga-nos</h3>
                    <div class="rodape-redes">
                        <a href="https://www.facebook.com/profile.php?id=100009378518512&locale=pt_BR" target="_blank"><img src="assets/icones/icon-facebook.svg" alt="Facebook"></a>
                        <a href="https://www.instagram.com/idelfranca_sede/" target="_blank"><img src="assets/icones/icon-instagram.svg" alt="Instagram"></a>
                        <a href="https://wa.me/5511954599252" target="_blank"><img src="assets/icones/icon-whatsapp.svg" alt="WhatsApp"></a>
                    </div>
                </div>

            </div>

            <!-- Créditos -->
            <div class="rodape-creditos">
                <p>© 2025 ASSOCIAÇÃO BENEFICENTE IRMÃ IDELFRANCA – Todos os direitos reservados.</p>
                <p>Desenvolvido por <a href="https://wa.me/5511952011031" target="_blank">Mike Araujo</a></p>
            </div>
        </div>
`
document.querySelector('#insert-radape').innerHTML = rodapeSite


