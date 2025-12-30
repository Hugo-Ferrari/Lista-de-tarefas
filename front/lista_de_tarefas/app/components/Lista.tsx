"use client"
import { useEffect, useState } from "react"

// Definimos o formato de cada item da lista
type ListaProps = {
    id: number
    text: string
    concluido: boolean
}

export function Lista() {
    const [input, setInput] = useState<string>("") // Texto da nova tarefa
    const [itens, setItens] = useState<ListaProps[]>([]) // Array com todas as tarefas
    const [carregado, setCarregado] = useState<boolean>(false) // Controle para evitar overwrite do localStorage
    
    //  edição
    const [idEdicao, setIdEdicao] = useState<number | null>(null) // Guarda o ID do item sendo editado
    const [textoEdicao, setTextoEdicao] = useState<string>("") // Guarda o novo texto temporariamente

    //  Roda apenas uma vez ao montar o componente
    useEffect(() => {
        const dadosSalvos = localStorage.getItem("@minha-lista:tarefas")
        if (dadosSalvos) {
            setItens(JSON.parse(dadosSalvos))
        }
        setCarregado(true) // Libera o salvamento automático após carregar os dados antigos
    }, [])

    //  Roda sempre que a lista de 'itens' mudar
    useEffect(() => {
        if (carregado) {
            localStorage.setItem("@minha-lista:tarefas", JSON.stringify(itens))
        }
    }, [itens, carregado])

    //  Adicionar nova tarefa
    const addItens = () => {
        if (input.trim() === "") return // Evita tarefas vazias

        const novoItem: ListaProps = {
            id: Date.now(), // Gera um ID único baseado no tempo
            text: input,
            concluido: false
        }

        setItens([...itens, novoItem]) //  cria novo array com o novo item
        setInput("") // Limpa o campo de entrada
    }

    //  Marcar/Desmarcar como concluído
    const alternarConcluido = (id: number) => {
        setItens(itens.map(item =>item.id === id ? { ...item, concluido: !item.concluido } : item))
    }

    //  Remover tarefa
    const remover = (id: number) => {
        setItens(itens.filter(item => item.id !== id))
    }

    //  Iniciar o modo de edição
    const iniciarEdicao = (item: ListaProps) => {
        setIdEdicao(item.id) // Define qual ID vamos editar
        setTextoEdicao(item.text) // Preenche o input de edição com o texto atual
    }

    //  Salvar a alteração feita no texto
    const salvarEdicao = (id: number) => {
        setItens(itens.map(item => item.id === id ? { ...item, text: textoEdicao } : item))
        setIdEdicao(null) // Fecha o modo de edição
        setTextoEdicao("") // Limpa o estado temporário
    }

    return (
        <div className="min-h-screen w-full p-4 flex flex-col justify-center items-center bg-gray-100 font-sans">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-md text-black">
                
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Minha Lista</h2>

                {/* adicionar tarefas */}
                <div className="flex gap-2 mb-6 w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItens()}
                        placeholder="O que precisa fazer?"
                        className="border-2 border-gray-200 p-2 rounded-lg flex-1 focus:border-blue-500 outline-none transition-colors text-base"
                    />
                    <button
                        onClick={addItens}
                        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        Adicionar
                    </button>
                </div>

                {/* lista de tarefas */}
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                    {itens.map((item) => (
                        <li key={item.id} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100 gap-2">
                            
                            {/* edição e visualizaçao */}
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={item.concluido}
                                        onChange={() => alternarConcluido(item.id)} 
                                        className="w-5 h-5 accent-green-500 cursor-pointer shrink-0"
                                    />
                                    {/* Se estiver editando este ID, esconde o texto e mostra o input */}
                                    {idEdicao !== item.id ? (
                                        <span className={`text-base truncate ${item.concluido ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {item.text}
                                        </span>
                                    ) : (
                                        <input 
                                            className="border-b border-blue-500 outline-none bg-transparent flex-1"
                                            value={textoEdicao}
                                            onChange={(e) => setTextoEdicao(e.target.value)}
                                            autoFocus
                                        />
                                    )}
                                </div>

                                {/* botao para se editar */}
                                <div className="flex gap-2">
                                    {idEdicao === item.id ? (
                                        <button onClick={() => salvarEdicao(item.id)} className="text-green-600 font-bold text-xs uppercase">Salvar</button>
                                    ) : (
                                        <button onClick={() => iniciarEdicao(item)} className="text-blue-500 hover:text-blue-700 text-xs uppercase font-bold">Editar</button>
                                    )}
                                    <button onClick={() => remover(item.id)} className="text-red-400 hover:text-red-600 text-xs uppercase font-bold">Excluir</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* se a lista etiver vazia aparecerá "Sua lista esta vazia" */}
                {itens.length === 0 && (
                    <p className="text-gray-400 text-center mt-4 italic">Sua lista está vazia.</p>
                )}

                {/*mostra quantas tarefas ainda faltam, quantas já foram concluidas */}
                <div className="flex justify-between w-full mt-6 pt-4 border-t border-gray-100 text-sm font-medium">
                    <p className="text-gray-600">
                        Concluídos: <span className="text-green-600">
                            {itens.filter(i => i.concluido).length} de {itens.length}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}