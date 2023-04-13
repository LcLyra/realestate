import { useState } from 'react';
import { ethers } from 'ethers';

import Casas from "./artifacts/contracts/Casas.sol/Casas.json"

import './App.css';

const casasAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  //Variáveis para AdicionarCasa
  const [nomeA, setNomeA] = useState("");
  const [precoA, setPrecoA] = useState("");
  const [precoAluguelA, setPrecoAluguelA] = useState("");
  const [enderecoA, setEnderecoA] = useState("");

  //Variáveis para VenderCasa
  const [nomeB, setNomeB] = useState("");
  const [quantidadeB, setQuantidadeB] = useState("");

  //Variáveis para DesistirVendaCasa
  const [nomeC, setNomeC] = useState("");
  const [quantidadeC, setQuantidadeC] = useState("");

  //Variáveis para ProporVistoria
  const[nomeD, setNomeD] = useState("");
  const[vistoriadorD, setVistoriadorD] = useState("");
  const[enderecoD, setEnderecoD] = useState("");

  //Variáveis para AceitarVistoria
  const[nomeE, setNomeE] = useState("");
  const[enderecoE, setEnderecoE] = useState("");
  const[escolhaE, setEscolhaE] = useState("");

  //Variáveis para ComprarCasa
  const[nomeF, setNomeF] = useState("");
  const[quantidadeF, setQuantidadeF] = useState("");
  const[enderecoF, setEnderecoF] = useState("");
  const[vistoriadorF, setVistoriadorF] = useState("");

  //Variáveis para VotacaoCasa
  const[nomeG, setNomeG] = useState("");
  const[escolhaG, setEscolhaG] = useState("");

  //Variáveis para AlugarCasa
  const[nomeH, setNomeH] = useState("");
  const[quantidadeH, setQuantidadeH] = useState("");

  //Variáveis para DesistirAluguel
  const[nomeI, setNomeI] = useState("");
  const{quantidadeI, setQuantidadeI} = useState("");

  //Variáveis para PagarAluguel
  const[nomeJ, setNomeJ] = useState("");

  //Variáveis para CobrarAluguel
  const[nomeK, setNomeK] = useState("");

  async function handleAdicionarCasa() {
    if (!nomeA || !precoA || !precoAluguelA || !enderecoA) {
      alert("Por favor, preencha os campos de nome, preço, preço de aluguel e endereço do dono");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){

    // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);

    // Chama a função do contrato
      try {
        const tx = await contract.AdicionarCasa(nomeA, precoA, precoAluguelA, enderecoA);
        await tx.wait();
        alert("Casa adicionada com sucesso!");
    } catch (err) {
      alert("Erro ao adicionar a casa: " + err.message);
    }
    }
  }
  
  async function handleVenderCasa() {
    if (!nomeB || !quantidadeB) {
      alert("Por favor, preencha os campos de nome e quantidade");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
    // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.VenderCasa(nomeB, quantidadeB);
        await tx.wait();
        alert("Casa posta para venda com sucesso!");
      } catch (err) {
        alert("Erro ao vender a casa: " + err.message);
      }
    }
  }

  async function handleDesistirVenda(){
    if (!nomeC || !quantidadeC) {
      alert("Por favor, preencha os campos de nome e quantidade");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
    // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.DesistirVendaCasa(nomeC, quantidadeC);
        await tx.wait();
        alert("Venda desistida com sucesso!");
      } catch (err) {
        alert("Erro ao desistr da venda: " + err.message);
      }
    }
  }

  async function handleProporVistoria(){
    if (!nomeD || !vistoriadorD || !enderecoD) {
      alert("Por favor, preencha os campos de nome, vistoriador e dono");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.ProporVistoria(nomeD, vistoriadorD, enderecoD);
        await tx.wait();
        alert("Vistoria proposta com sucesso!");
      } catch (err) {
        alert("Erro ao propor vistoria: " + err.message);
      }
    }
  }
  
  async function handleAceitarVistoria(){
    if (!nomeE || !enderecoE || !escolhaE) {
      alert("Por favor, preencha os campos de nome, endereco e escolha");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
    // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.AceitarVistoria(nomeE, enderecoE, escolhaE);
        await tx.wait();
        alert("Vistoria aceitar com sucesso!");
      } catch (err) {
        alert("Erro ao aceitar vistoria: " + err.message);
      }
    } 
  }

  async function handleComprarCasa(){
    if (!nomeF || !quantidadeF || !enderecoF || !vistoriadorF) {
      alert("Por favor, preencha os campos de nome, quantidade, dono e vistoriador");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.ComprarCasa(nomeF,quantidadeF,enderecoF, vistoriadorF);
        await tx.wait();
        alert("Vistoria aceitar com sucesso!");
      } catch (err) {
        alert("Erro ao aceitar vistoria: " + err.message);
      } 
    }
  }

  async function handleVotacaoCasa(){
    if (!nomeG || !escolhaG) {
      alert("Por favor, preencha os campos de nome e escolha");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.VotacaoCasa(nomeG, escolhaG);
        await tx.wait();
        alert("Votado com sucesso!");
      } catch (err) {
        alert("Erro ao votar: " + err.message);
      }
    } 
  }

  async function handleAlugarCasa(){
    if (!nomeH || !quantidadeH) {
      alert("Por favor, preencha os campos de nome e escolha");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.AlugarCasa(nomeH, quantidadeH);
        await tx.wait();
        alert("Alugado com sucesso!");
      } catch (err) {
        alert("Erro ao alugar: " + err.message);
      }
    }
  }

  async function handleDesistirAluguel(){
    if (!nomeI || !quantidadeI) {
      alert("Por favor, preencha os campos de nome e escolha");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.DesistirAluguel(nomeI, quantidadeI);
        await tx.wait();
        alert("Aluguel desistido com sucesso!");
      } catch (err) {
        alert("Erro ao desistir: " + err.message);
      }
    }  
  }

  async function handlePagarAluguel() {
    if (!nomeJ) {
      alert("Por favor, preencha os campos de nome");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.PagarAluguel(nomeJ);
        await tx.wait();
        alert("Aluguel pago com sucesso!");
      } catch (err) {
        alert("Erro ao pagar aluguel: " + err.message);
      }
    }
  }

  async function handleCobrarAluguel() {
    if (!nomeK) {
      alert("Por favor, preencha os campos de nome");
      return;
    }
    if(typeof window.ethereum !== 'undefined'){
      // Conecta a uma instância do contrato
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Casas.address, Casas.abi, signer);
      try {
        const tx = await contract.CobrarAluguel(nomeK);
        await tx.wait();
        alert("Aluguel cobrado com sucesso!");
      } catch (err) {
        alert("Erro ao cobrar aluguel: " + err.message);
      }
    }
  }

  return (
    <div>
      <h2>RealEstate descentralizado</h2>
      <h3>Adicionar Casa</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleAdicionarCasa(); }}>
        <label>
          Nome:
          <input type="text" value={nomeA} onChange={(e) => setNomeA(e.target.value)} />
        </label>
        <label>
          Preço:
          <input type="number" value={precoA} onChange={(e) => setPrecoA(e.target.value)} />
        </label>
        <label>
          Preco Aluguel:
          <input type="number" value={precoAluguelA} onChange={(e) => setPrecoAluguelA(e.target.value)} />
        </label>
        <label>
          Dono:
          <input type="text" value={enderecoA} onChange={(e) => setEnderecoA(e.target.value)} />
        </label>
        <button type="submit">Adicionar Casa</button>
      </form>

      <h3>Vender Casa</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleVenderCasa(); }}>
        <label>
          Nome:
          <input type="text" value={nomeB} onChange={(e) => setNomeB(e.target.value)} />
        </label>
        <label>
          quantidade:
          <input type="number" value={quantidadeB} onChange={(e) => setQuantidadeB(e.target.value)} />
        </label>
        <button type="submit">Vender Casa</button>
      </form>

      <h3>Desistir Venda</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleDesistirVenda(); }}>
        <label>
          Nome:
          <input type="text" value={nomeC} onChange={(e) => setNomeC(e.target.value)} />
        </label>
        <label>
          quantidade:
          <input type="number" value={quantidadeC} onChange={(e) => setQuantidadeC(e.target.value)} />
        </label>
        <button type="submit">Desistir da venda</button>
      </form>

      <h3>Propor Vistoria</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleProporVistoria(); }}>
        <label>
          Nome:
          <input type="text" value={nomeD} onChange={(e) => setNomeD(e.target.value)} />
        </label>
        <label>
          Vistoriador:
          <input type="text" value={vistoriadorD} onChange={(e) => setVistoriadorD(e.target.value)} />
        </label>
        <label>
          Dono:
          <input type="text" value={enderecoD} onChange={(e) => setEnderecoD(e.target.value)} />
        </label>
        <button type="submit">ProporVistoria</button>
      </form>

      <h3>Aceitar Vistoria</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleAceitarVistoria(); }}>
        <label>
          Nome:
          <input type="text" value={nomeE} onChange={(e) => setNomeE(e.target.value)} />
        </label>
        <label>
          Dono:
          <input type="text" value={enderecoE} onChange={(e) => setEnderecoE(e.target.value)} />
        </label>
        <label>
          Escolha:
          <input type="text" value={escolhaE} onChange={(e) => setEscolhaE(e.target.value)} />
        </label>
        <button type="submit">AceitarVistoria</button>
      </form>

      <h3>Comprar Casa</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleComprarCasa(); }}>
        <label>
          Nome:
          <input type="text" value={nomeF} onChange={(e) => setNomeF(e.target.value)} />
        </label>
        <label>
          Quantidade:
          <input type="number" value={quantidadeF} onChange={(e) => setQuantidadeF(e.target.value)} />
        </label>
        <label>
          Dono:
          <input type="text" value={enderecoF} onChange={(e) => setEnderecoF(e.target.value)} />
        </label>
        <label>
          Vistoriador:
          <input type="text" value={vistoriadorF} onChange={(e) => setVistoriadorF(e.target.value)} />
        </label>
        <button type="submit">Comprar Casa</button>
      </form>

      <h3>Votar</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleVotacaoCasa(); }}>
        <label>
          Nome:
          <input type="text" value={nomeG} onChange={(e) => setNomeG(e.target.value)} />
        </label>
        <label>
          Escolha:
          <input type="text" value={escolhaG} onChange={(e) => setEscolhaG(e.target.value)} />
        </label> 
        <button type="submit">Votar</button>
      </form>

      <h3>Alugar Casa</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleAlugarCasa(); }}>
        <label>
          Nome:
          <input type="text" value={nomeH} onChange={(e) => setNomeH(e.target.value)} />
        </label>
        <label>
          quantidade:
          <input type="number" value={quantidadeH} onChange={(e) => setQuantidadeH(e.target.value)} />
        </label>
        <button type="submit">Alugar Casa</button>
      </form>

      <h3>Desistir aluguel</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleDesistirAluguel(); }}>
        <label>
          Nome:
          <input type="text" value={nomeI} onChange={(e) => setNomeI(e.target.value)} />
        </label>
        <label>
          quantidade:
          <input type="number" value={quantidadeI} onChange={(e) => setQuantidadeI(e.target.value)} />
        </label>
        <button type="submit">Desistir</button>
      </form>

      <h3>Pagar Aluguel</h3>
      <form onSubmit={(e) => { e.preventDefault(); handlePagarAluguel(); }}>
        <label>
          Nome:
          <input type="text" value={nomeJ} onChange={(e) => setNomeJ(e.target.value)} />
        </label>
        <button type="submit">Pagar aluguel</button>
      </form>

      <h3>Cobrar Aluguel</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleCobrarAluguel(); }}>
        <label>
          Nome:
          <input type="text" value={nomeK} onChange={(e) => setNomeK(e.target.value)} />
        </label>
        <button type="submit">Cobrar  aluguel</button>
      </form>
    </div>
  );
}

export default App;











