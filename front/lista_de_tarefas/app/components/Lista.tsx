"use client"
import { useState } from "react"

type ListaProps = {
  id: number
  text: string
  concluido: boolean
}

export function Lista() {
  const [input, setInput] = useState<string>("")
  const [itens, setItens] = useState<ListaProps[]>([]) // lista tipada de items


  const addItens = () => {
    if (input.trim() === "") return

    const novoItem: ListaProps = {
      id: Date.now(),
      text: input,
      concluido: false // Todo item começa não concluído
    }

    setItens([...itens, novoItem]) //adiciona um item novo sem alterar o anterior 
    setInput("")
  }

  // Inverte o estado de apenas UM item específico
  const alternarConcluido = (id: number) => {
    setItens(itens.map(item =>
      item.id === id ? { ...item, concluido: !item.concluido } : item
    ))
  }

  const Remover = (id: number) => { //remove os items cada um pelo seu id
    setItens(itens.filter(item => item.id !== id))
  }

  return (
    <div className="h-screen w-screen p-4 flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Minha Lista</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} //guarda o input para colocar na lista
            placeholder="O que precisa fazer?"
            className="border-2 border-gray-200 p-2 rounded-lg flex-1 focus:border-blue-500 outline-none transition-colors text-black"
          />
          <button
            onClick={addItens} //adiciona os itens para a lista 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Adicionar
          </button>
        </div>

        <ul className="space-y-3">
          {itens.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.concluido} // Agora olha para o estado do ITEM (individual)
                  onChange={() => alternarConcluido(item.id)} // Inverte apenas este item (iniidividual)
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />

                <span className={`text-lg transition-all ${item.concluido ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </div>

              <button
                onClick={() => Remover(item.id)} // remove o item por id,( individual)
                className="text-red-400 hover:text-red-600 text-sm font-semibold transition-colors"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        {itens.length === 0 && (
          <p className="text-gray-400 text-center mt-4">Sua lista está vazia.</p> // caso nn tenha nenhum item

        )}
        <div className="flex justify-between w-full mb-4 text-sm font-medium py-5">
        <p className="text-gray-600">
          Concluídos: <span className="text-green-600"> 
            {itens.filter(i => i.concluido).length} de {itens.length} {/*olha a quantidade total e avisa quantas tarefas já foram concluidas */}
          </span>
        </p>
      </div>
      </div>
      
    </div>
  )
}