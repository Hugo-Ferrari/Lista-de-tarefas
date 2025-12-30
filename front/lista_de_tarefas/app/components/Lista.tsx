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
    // Criamos um estado para saber quando o componente terminou de carregar
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        const dadosSalvos = localStorage.getItem("@minha-lista:tarefas")
        if (dadosSalvos) {
            // JSON.parse(texto): Pega o texto que veio do getItem e transforma de volta em uma lista de objetos para o React usar.
            setItens(JSON.parse(dadosSalvos)) 
        }
        setCarregado(true) // Marca que o carregamento inicial foi feito
    }, [])

    useEffect(() => {
        // CORREÇÃO: Verificamos se o componente já carregou os dados iniciais antes de salvar.
        // Isso impede que uma lista vazia inicial apague seus dados salvos no localStorage.
        if (carregado) {
            // salva ou atualiza um dado 
            // JSON.stringify(lista): Transforma sua lista de tarefas em uma string para poder usar o setItem.
            localStorage.setItem("@minha-lista:tarefas", JSON.stringify(itens))
        }
    }, [itens, carregado]) // Faz a leitura sempre que a lista de itens mudar



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
        // remove itens a partir do id (remove itens em ordem individual)
        setItens(itens.filter(item => item.id !== id)) 
    }

    const editarItem = (id: number, novoTexto: string) => {
        setItens(itens.map(item => item.id === id ? { ...item, text: novoTexto } : item))
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
                        // Adicionando um atalho para facilitar o uso:
                        onKeyDown={(e) => e.key === 'Enter' && addItens()} //usuário possa apenas apertar "Enter" em vez de ter que clicar no botão sempre.
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

                <ul className="space-y-3 max-h-[400px] ">
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
                                onClick={() => Remover(item.id)}
                                className="text-red-400 hover:text-red-600 active:text-red-800 text-sm font-semibold transition-colors shrink-0"
                            >
                                Remover
                            </button>
                            
                        </li>
                    ))}
                </ul>

                {itens.length === 0 && ( //se os itens estiverem zerados, aparece "sua lista esta vazia"
                    <p className="text-gray-400 text-center mt-4 italic">Sua lista está vazia.</p>
                )}

                <div className="flex justify-between w-full mt-6 pt-4 border-t border-gray-100 text-sm font-medium">
                    <p className="text-gray-600">
                        Concluídos: <span className="text-green-600">
                            {/* filtra os items e separa qual foi concluido e quais ainda nn foram */}
                            {itens.filter(i => i.concluido).length} de {itens.length} 
                        </span>
                    </p>
                </div>
            </div>

        </div>
    )
}