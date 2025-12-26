"use client"
import { useEffect, useState } from "react"

type ListaProps = {
    id: number
    text: string
    concluido: boolean
}

export function Lista() {
    const [input, setInput] = useState<string>("")
    const [itens, setItens] = useState<ListaProps[]>([])

    useEffect(() => {
        const dadosSalvos = localStorage.getItem("@minha-lista:tarefas")
        if (dadosSalvos) {
            setItens(JSON.parse(dadosSalvos)) //JSON.parse(texto): Pega o texto que veio do getItem e transforma de volta em uma lista de objetos para o React usar.
        }
    }, [])
    useEffect(() => {
        if (itens.length < 0 || localStorage.getItem("@minha-lista:tarefas")) {// faz a leitura de um dado que foi salvo
            localStorage.setItem("@minha-lista:tarefas", JSON.stringify(itens)) // salva ou atualiza um dado 
            //JSON.stringify(lista): Transforma sua lista de tarefas em uma string para poder usar o setItem.
        }
    }, [itens])



    const addItens = () => {
        if (input.trim() === "") return

        const novoItem: ListaProps = {
            id: Date.now(),
            text: input,
            concluido: false
        }

        setItens([...itens, novoItem]) // adiciona um item novo sem modificar o anterior
        setInput("")
    }

    const alternarConcluido = (id: number) => {
        setItens(itens.map(item =>
            item.id === id ? { ...item, concluido: !item.concluido } : item 
        ))
    }

    const Remover = (id: number) => {
        setItens(itens.filter(item => item.id !== id)) //remove itens a partir do id (remove itens em ordem individual)
    }

    return (

        <div className="min-h-screen w-full p-4 flex flex-col justify-center items-center bg-gray-100 font-sans">


            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Minha Lista</h2>


                <div className="flex gap-2 mb-6 w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="O que precisa fazer?"

                        className="border-2 border-gray-200 p-2 rounded-lg flex-1 min-w-0 focus:border-blue-500 outline-none transition-colors text-black text-base"
                    />
                    <button
                        onClick={addItens}

                        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 rounded-lg font-medium transition-all shrink-0"
                    >
                        Adicionar
                    </button>
                </div>


                <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {itens.map((item) => (
                        <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <input
                                    type="checkbox"
                                    checked={item.concluido}
                                    onChange={() => alternarConcluido(item.id)}
                                    className="w-5 h-5 accent-green-500 cursor-pointer shrink-0"
                                />

                                <span className={`text-base transition-all truncate ${item.concluido ? 'line-through text-gray-400' : 'text-gray-700'
                                    }`}>
                                    {item.text}
                                </span>
                            </div>

                            <button
                                onClick={() => Remover(item.id)} {/*remove o item pelo id */}
                                className="text-red-400 hover:text-red-600 active:text-red-800 text-sm font-semibold transition-colors shrink-0"
                            >
                                Remover
                            </button>
                        </li>
                    ))}
                </ul>

                {itens.length === 0 && (
                    <p className="text-gray-400 text-center mt-4 italic">Sua lista está vazia.</p>
                )}


                <div className="flex justify-between w-full mt-6 pt-4 border-t border-gray-100 text-sm font-medium">
                    <p className="text-gray-600">
                        Concluídos: <span className="text-green-600">
                            {itens.filter(i => i.concluido).length} de {itens.length} {/* filtra os items e separa qual foi concluido e quais ainda nn foram */}
                        </span>
                    </p>
                </div>
            </div>

        </div>
    )
}