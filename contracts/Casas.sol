//SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

//Para testes, os requires estão comparando os msg.value com maior ou igual //substituir por ==
//Adicionar opção dos donos mudarem o preço do aluguel e da casa
 
contract Casas {

    address payable nois; //endereço da nossa empresa

    struct vistoria{
        address endereco; //Endereço do vistoriador
        mapping(string => bool) casaVistoria; //casa da vistoria
    }

    struct vistoriador{
        bool Indisponibilidade; //Indicador se o vistoriador está ocupado ou não
    }
    
    struct dono{
        mapping(string => uint) porcentagem; //% que o dono possui da casa
        mapping(string => bool) vendeSe; //Indicador de intenção de venda
        mapping(string => uint) quantidadeQuerVender; //Quantidade que o dono quer vender
        mapping(string => bool) escolhaAluguel; //Decisão do dono sobre alugar ou não a casa
        mapping(string => vistoria) vistoriaVenda; //Vistoria da casa que o dono está vendendo
        mapping(string => uint) aluguelAReceber; // % que cada dono vai receber do aluguel
        mapping(string=>bool) aluguelJaCobrado; //Indica se o dono já cobrou ou n o aluguel    
    }

    struct inquilino{
        mapping(string => uint) porcentagemI; // % que o inquilino aluga da casa
    }
 
    struct casa{
        uint preco;
        uint precoAluguel;
        address [] donosDaCasa;
        uint votacao; //Indica a % dos donos da casas que votou para aluguel
        bool casaAalugar;//Indica se a casa está para aluguel ou n
        uint porcentagemAlugada; // % da casa que está alugada
        bool casaAlugada; // Indicador se 100% da casa está alugada
        uint qtdPaga; //Indicador da % total do aluguel que já foi paga
        uint qtdjacobrada; //Indicador da % total do aluguel que já foi cobrada
    }
      
    mapping(string => casa) casas;
    mapping(address => dono) donos;
    mapping(address => inquilino) inquilinos;
    mapping(address => vistoriador) vistoriadores;

    event casaAdicionada(string nome, uint preco, uint precoAluguel, address dono);
    event casaAVenda(address dono, string casa, uint qtd);
    event casaNVenda(address dono, string casa, uint qtd);
    event vistoriaProposta(address dono, string casa, address vistoriador);
    event vistoriaAceita(address vistoriador, string casa, address dono, bool _escolha);
    event casaComprada(string casa, address DeQuem, address ParaQuem, uint qtd, address vistoriador, uint valorPago);
    event votacaoRealizada(string casa, address votador, bool _escolha, uint resultado, bool aluguelOuN);
    event casaAlugada(string casa, uint qtd, address inquilino, uint valorAserPago);
    event casaDesistida(string casa, uint qtd, address inquilino);
    event aluguelPago(string casa, address inquilino, uint valor);
    event aluguelCompletamentePago(string casa);
    event aluguelCobrado(string casa, address dono, uint valor);
    event aluguelCompletamenteCobrado(string casa);

    constructor(address payable _moderadores) {
        nois = _moderadores;
    }

    function AdicionarCasa(string memory qualCasa, uint _preco, uint _precoAluguel, address _dono) public {
        require(msg.sender == nois, "vc n e nois");
        casas[qualCasa].preco = _preco;
        casas[qualCasa].precoAluguel = _precoAluguel;
        donos[_dono].porcentagem[qualCasa] = 100;
        casas[qualCasa].porcentagemAlugada = 0;
        casas[qualCasa].casaAlugada = false;
        donos[_dono].aluguelAReceber[qualCasa] = 100;
        casas[qualCasa].qtdPaga = 0;
        casas[qualCasa].qtdjacobrada = 0;
        (casas[qualCasa].donosDaCasa).push(_dono);
        emit casaAdicionada(qualCasa, _preco, _precoAluguel, _dono);
    }

    function VenderCasa(string memory qualCasa, uint quantidade) public payable { //Dono coloca % para venda
        require(donos[msg.sender].porcentagem[qualCasa] >= quantidade, "Vc n possui essa %");
        require(msg.value >= casas[qualCasa].preco/100, "Vc n possui saldo");
        require(donos[msg.sender].quantidadeQuerVender[qualCasa] != quantidade, "essa % ja esta a venda");

        uint valor = casas[qualCasa].preco * (quantidade/100);
        donos[msg.sender].quantidadeQuerVender[qualCasa] = quantidade;

        uint panois = valor / 100;

        emit casaAVenda(msg.sender, qualCasa, quantidade);

        donos[msg.sender].vendeSe[qualCasa] = true;
        nois.transfer(panois);
    }

    function DesistirVendaCasa(string memory qualCasa, uint quantidade) public { //Dono desiste de vender %
        require(donos[msg.sender].porcentagem[qualCasa] > 0, "Vc n possui essa casa");
        require(donos[msg.sender].quantidadeQuerVender[qualCasa] <= quantidade, "vc n esta vendendo essa quantidade");

        donos[msg.sender].quantidadeQuerVender[qualCasa] -= quantidade;

        if(donos[msg.sender].quantidadeQuerVender[qualCasa] == 0){ //Vendendor desiste de vender toda sua %
            donos[msg.sender].vendeSe[qualCasa] = false;
        }
        emit casaNVenda(msg.sender, qualCasa, quantidade);
    }

    function ProporVistoria(string memory qualCasa, address _vistoriador, address deQuem) public { //Dono escolhe um vistoriador 
        require(msg.sender == nois, "vc n e nois");
        require(donos[deQuem].porcentagem[qualCasa] > 0, "Esse endereco n possui essa casa");
        require(donos[deQuem].vendeSe[qualCasa] == true, "Esse endereco n esta vendendo essa casa");
        donos[deQuem].vistoriaVenda[qualCasa].endereco = _vistoriador;
        emit vistoriaProposta(deQuem, qualCasa, _vistoriador);
    }

    function AceitarVistoria(string memory qualCasa, address deQuem, bool escolha) public { //Vistoriador aceita participar da venda
        require(donos[deQuem].vistoriaVenda[qualCasa].endereco == msg.sender,"vc n foi o vistoriador escolhido");
        require(vistoriadores[msg.sender].Indisponibilidade == false,"vc n esta disponivel");
        donos[deQuem].vistoriaVenda[qualCasa].casaVistoria[qualCasa] = escolha; //Vistoriador aceita ou n
        if(escolha == true){
            vistoriadores[msg.sender].Indisponibilidade == true; //Vistoriador esta ocupado com essa venda agr
        }
        emit vistoriaAceita(msg.sender, qualCasa, deQuem, escolha);
    }

    function ComprarCasa(string memory qualCasa, uint quantidade, address payable deQuem, address payable _vistoriador) public payable { //Usuário compra % de alguma casa
        uint valor = casas[qualCasa].preco * (quantidade/100);
        uint panois = valor / 100;
        uint custoVistoria = valor * 5/1000;
        uint taxaVistoria = custoVistoria/100;
        uint parteComprador = valor + custoVistoria;

        require(donos[deQuem].quantidadeQuerVender[qualCasa] >= quantidade, "Ele n t vendendo essa quantidade");
        require(msg.value >= parteComprador, "vc n possui saldo"); //comprador paga vistoria
        require(donos[deQuem].vistoriaVenda[qualCasa].casaVistoria[qualCasa] == true, "A vistoria n esta sendo feita");

        if(donos[msg.sender].porcentagem[qualCasa] == 0){ //Passa a ser dono da casa
            (casas[qualCasa].donosDaCasa).push(msg.sender);
        }

        donos[deQuem].porcentagem[qualCasa] -= quantidade; // % vendedor diminui
        donos[msg.sender].porcentagem[qualCasa] += quantidade; // % comprador aumenta

        donos[deQuem].quantidadeQuerVender[qualCasa] -= quantidade; //% que o vendedor quer vender diminui

        donos[deQuem].aluguelAReceber[qualCasa] -= casas[qualCasa].precoAluguel * quantidade/100; //Quanto o vendedor vai receber de aluguel por essa casa
        donos[msg.sender].aluguelAReceber[qualCasa] += casas[qualCasa].precoAluguel * quantidade/100; //Quanto o comprador  vai receber de aluguel por essa casa

        donos[msg.sender].escolhaAluguel[qualCasa] = donos[deQuem].escolhaAluguel[qualCasa]; //A última escolha do antigo dono sobre a votação do aluguel passa para o novo dono

        if(donos[deQuem].porcentagem[qualCasa] == 0){ //Deixa de ser dono da casa
            for (uint i=0; i<casas[qualCasa].donosDaCasa.length ; i++){
                if(deQuem == casas[qualCasa].donosDaCasa[i]){
                    delete casas[qualCasa].donosDaCasa[i];
                    casas[qualCasa].donosDaCasa[i] = casas[qualCasa].donosDaCasa[casas[qualCasa].donosDaCasa.length - 1];
                    casas[qualCasa].donosDaCasa.pop();
                }
            }
        }

        if(donos[deQuem].quantidadeQuerVender[qualCasa] == 0){ //VIstoriador só passa a estar disponível se toda a % do dono for vendida
            vistoriadores[_vistoriador].Indisponibilidade = false; //Vistoriador passa a estar disponível
        }

        deQuem.transfer(valor-panois); //vendedor paga a taxa para gente
        _vistoriador.transfer(custoVistoria-taxaVistoria); //vistoriador paga sua taxa para gente
        nois.transfer(panois+taxaVistoria);

        emit casaComprada(qualCasa, deQuem, msg.sender, quantidade, _vistoriador, valor);        
    }

    function votacaoCasa(string memory qualCasa, bool escolha) public{ //Donos da casa decidem pelo aluguel ou não
        require(donos[msg.sender].porcentagem[qualCasa] > 0, "Vc n possui essa casa");
        require(escolha =! donos[msg.sender].escolhaAluguel[qualCasa], "vc ja fez essa escolha"); //A escolha anterior já foi essa, para não haver repetição na aritmética do contador
        
        if(escolha==true){ //Se o dono quer alugar, o contador é somado com a % que ele possui
            casas[qualCasa].votacao = casas[qualCasa].votacao + donos[msg.sender].porcentagem[qualCasa];  
        }
        if(escolha==false){//Se o dono n quer alugar, o contador é subtraido com % que ele possui
            casas[qualCasa].votacao = casas[qualCasa].votacao + donos[msg.sender].porcentagem[qualCasa];  
        }

        if(casas[qualCasa].votacao == 100){
            casas[qualCasa].casaAalugar = true;
        }
        else{
            casas[qualCasa].casaAalugar = false;
        }

        donos[msg.sender].escolhaAluguel[qualCasa] = escolha;
        emit votacaoRealizada(qualCasa, msg.sender, escolha, casas[qualCasa].votacao, casas[qualCasa].casaAalugar);
    }
    
    function AlugarCasa(string memory qualCasa, uint quantidade) public payable{ //Usuário aluga % da casa
        uint valor = casas[qualCasa].precoAluguel * (quantidade/100);
        uint panois = valor / 100; 

        require(casas[qualCasa].casaAalugar == true, "a casa n esta para aluguel");
        require(msg.value >= valor + panois, "vc n possui saldo");
        require(casas[qualCasa].casaAlugada == false, "A casa ja esta completamente alugada");
        require(casas[qualCasa].porcentagemAlugada + quantidade <= 100, "N da p alugar essa qtd");

        casas[qualCasa].porcentagemAlugada += quantidade; // % alugada da casa aumenta
        inquilinos[msg.sender].porcentagemI[qualCasa] += quantidade; // % do usuario aumenta

        if(casas[qualCasa].porcentagemAlugada == 100){ // casa completamente alugada
            casas[qualCasa].casaAlugada = true;
        }

        nois.transfer(panois);
        emit casaAlugada(qualCasa, quantidade, msg.sender, valor);
    }

    function DesistirAluguel(string memory qualCasa, uint quantidade) public{ //inquilino desiste de alugar % da casa
        require (inquilinos[msg.sender].porcentagemI[qualCasa] > 0, "vc n aluga essa casa");
        require (inquilinos[msg.sender].porcentagemI[qualCasa] > quantidade, "vc n possui essa quantidade p desistir");
    
        casas[qualCasa].porcentagemAlugada -= quantidade;
        inquilinos[msg.sender].porcentagemI[qualCasa] -= quantidade;        
    
        casas[qualCasa].casaAlugada = false; //casa deixa de estar completamente alugada
     
        emit casaDesistida(qualCasa, quantidade, msg.sender);
    }

    function PagarAluguel(string memory qualCasa) public payable{ //Inquilino paga o aluguel
        uint valor = casas[qualCasa].precoAluguel * (inquilinos[msg.sender].porcentagemI[qualCasa]/100); //Inquilino paga aluguel proporcional a sua %
        require(casas[qualCasa].casaAlugada = true, "a casa n esta completamente alugada");
        require(inquilinos[msg.sender].porcentagemI[qualCasa] > 0, "vc n aluga essa casa");
        require(msg.value == valor, "vc n possui saldo");
        require(casas[qualCasa].qtdPaga != 100, "O aluguel ja foi completamente pago");
    
        emit aluguelPago(qualCasa, msg.sender, valor);
    
        casas[qualCasa].qtdPaga += inquilinos[msg.sender].porcentagemI[qualCasa]; //A % do aluguel paga aumenta
        if(casas[qualCasa].qtdPaga == 100){ 
            emit aluguelCompletamentePago(qualCasa);
        } 
    }

    function CobrarAluguel(string memory qualCasa) public payable{ //Dono cobra aluguel 
        require(donos[msg.sender].porcentagem[qualCasa] > 0, "Vc n possui essa casa");
        require(casas[qualCasa].qtdPaga == 100, "O aluguel n foi completamente pago");
        require(donos[msg.sender].aluguelJaCobrado[qualCasa] == false,"vc ja cobrou o aluguel dessa casa");
        
        address payable receptor = payable(msg.sender);
        receptor.transfer(donos[msg.sender].aluguelAReceber[qualCasa]);
        
        donos[msg.sender].aluguelJaCobrado[qualCasa] = true;
        casas[qualCasa].qtdjacobrada += donos[msg.sender].porcentagem[qualCasa];
        emit aluguelCobrado(qualCasa, msg.sender, donos[msg.sender].porcentagem[qualCasa]);
        
        if(casas[qualCasa].qtdjacobrada == 100){ //nova rodada de aluguel
            casas[qualCasa].qtdPaga = 0; 
            casas[qualCasa].qtdjacobrada = 0;
            for (uint i=0; i<(casas[qualCasa].donosDaCasa).length ; i++){
                donos[(casas[qualCasa].donosDaCasa[i])].aluguelJaCobrado[qualCasa] = false;
        }          
        emit aluguelCompletamenteCobrado(qualCasa);
        }
    }
   
    function IndicadorPreco(string memory qualCasa) public view returns (uint){
        return casas[qualCasa].preco;
    }

    function IndicadorPrecoAluguel(string memory qualCasa) public view returns(uint){
        return casas[qualCasa].precoAluguel;
    } 

    function IndicadorDonos(string memory qualCasa, address _suposto) public view returns(uint){
        return donos[_suposto].porcentagem[qualCasa];
    } 

    function IndicadorIndisponibilidade(address _vistoriador) public view returns(bool){
        return vistoriadores[_vistoriador].Indisponibilidade;
    }

    function IndicadorVendeSe(string memory qualCasa, address _dono) public view returns(uint){
        return donos[_dono].quantidadeQuerVender[qualCasa];
    }

    function IndicadorAAlugar(string memory qualCasa) public view returns(bool){
        return casas[qualCasa].casaAalugar;
    }

    function IndicadorPorcentagemAlugada(string memory qualCasa) public view returns(uint){
        return casas[qualCasa].porcentagemAlugada;
    }

    function IndicadorInquilinos(string memory qualCasa, address _suposto) public view returns(uint){
        return inquilinos[_suposto].porcentagemI[qualCasa];
    }  
      
    receive() external payable {}
}
 