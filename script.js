const buscar = ()=>{   
    /* 
    *  Função usada para realizar consultas de CEP na Brasil API
    *    disponível em https://brasilapi.com.br
    *  Entrada: oito dígitos de um CEP
    *  Saída: Retorna o endereço correspondente em um objeto JSON
    */
    const metodo = "GET";  // método HTTP de entrada
    const url = "https://brasilapi.com.br/api/cep/v2/";  // endereço da API

    let cep = document.querySelector("#cep").value;  // lê input CEP
    let resultado = document.querySelector("#resultado");  // local de gravar resultado
    let xhr = new XMLHttpRequest();  // novo objeto XHR
    
    xhr.open(metodo, url+cep);  // consulta a api passando o cep desejado
    xhr.responseType = "json";  // resposta deve ser tratada como um arquivo json

    xhr.onreadystatechange = ()=>{  // escuta as mudanças de estado da conexão assíncrona
        
        // status 200=>ok, readyState 4=>concluído
        if(xhr.status == 200 && xhr.readyState == 4){ 

            console.log(xhr.response);  // imprime resposta no console

            // pega cada informação e grava separadamente em constantes
            const cep = xhr.response.cep;
            const rua = xhr.response.street;
            const bairro = xhr.response.neighborhood;
            const cidade = xhr.response.city;
            const estado = xhr.response.state;
            const latitude = xhr.response.location.coordinates.latitude;
            const longitude = xhr.response.location.coordinates.longitude;

            // formata resultado a ser exibido
            resultado.innerHTML =  `<h1>${cep}</h1>`;
            resultado.innerHTML += `<p>${rua}. ${bairro}. ${cidade} - ${estado}.</p>`;
            
            // chama a função que insere o mapa
            desenhaMapa(resultado, latitude, longitude, cep); 
        }
    }

    xhr.send();

}

const desenhaMapa = (resultado, latitude, longitude, cep)=>{
    /*
    *  Função utilizada para gerar um mapa interativo com a biblioteca Leaflet
    *  Requer que os arquivos CSS/JS sejam chamados no index.html
    */

    // insere a div que receberá o mapa
    resultado.innerHTML += "<div id='map' style='width:100%;height:500px;'></div>";

    // cria o mapa com dados de latitude e longitude (14 corresponde ao nível de zoom)
    const mapa = L.map('map').setView([latitude, longitude], 14);

    // carrega mapas do openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

    // adiciona um balão de popup indicando o cep
    L.marker([latitude, longitude]).addTo(mapa)
        .bindPopup("CEP: "+cep)
        .openPopup();

}