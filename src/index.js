import "./style.css";
import { Aposta, ApostaLista } from "./classes";
import { novaApostaHtml } from "./components/nova-aposta-html";

const inNome = document.querySelector("#inNome");
const inPeso = document.querySelector("#inPeso");
const outApostas = document.querySelector("#outApostas");

let lista = new ApostaLista();
let apostas = [];

document.querySelector("#btApostar").addEventListener("click", () => {
  const aposta = new Aposta(inNome.value, inPeso.value);

  outApostas.appendChild(novaApostaHtml(aposta));

  lista.novaAposta(aposta);
  apostas.push(aposta);
  console.log(apostas);

  inNome.value = "";
  inPeso.value = "";
  inNome.focus();
});

outApostas.addEventListener("click", (event) => {
  const id = event.target.getAttribute("data-id");

  lista.ativarDesativar(id);
  event.target.classList.contains("inativo")
    ? event.target.classList.remove("inativo")
    : event.target.classList.add("inativo");
});

document.querySelector("#btCancelar").addEventListener("click", () => {
  const dados = lista.get();

  if (dados.filter((x) => !x.ativo).length == 0) {
    alert("Selecione a aposta a ser cancelada clicando sobre ela na lista...");
    return;
  }

  lista.removerInativos();

  let htmlApostas = Array.from(outApostas.children);

  for (let i = htmlApostas.length - 1; i >= 0; i--) {
    if (htmlApostas[i].classList.contains("inativo")) {
      outApostas.removeChild(htmlApostas[i]);
      console.log(htmlApostas[i].getAttribute("data-id"));
      apostas = apostas.filters(
        (aposta) => aposta.id !== Number(htmlApostas[i].getAttribute("data-id"))
      );
    }
  }
});

document.querySelector("#btLimpar").addEventListener("click", () => {
  if (!confirm("Confirma exclusão de todas as apostas?")) {
    return;
  }

  // enquanto houver um filho em outApostas, irá removê-lo
  while (outApostas.firstChild) {
    outApostas.removeChild(outApostas.firstChild);
  }
  apostas = [];
  lista = new ApostaLista();
});

document.querySelector("#btVencedor").addEventListener("click", () => {
  // determina que o peso fique entre 8.0 a 12.0
  const pesoMelancia = (8 + 4 * Math.random()).toFixed(1) * 1000;
  const apostasDiferenca = apostas.map((aposta) => {
    return {
      ...aposta,
      diferanca: Math.abs(aposta.peso - pesoMelancia),
    };
  });
  let vencedor;
  for (const aposta of apostasDiferenca) {
    if (!vencedor) {
      vencedor = aposta;
    }
    if (aposta.diferanca < vencedor.diferanca) {
      vencedor = aposta;
    }
  }
  alert(
    `O peso da melancia é ${pesoMelancia}gr\nParabens o(a) ${vencedor.nome}!`
  );
});
